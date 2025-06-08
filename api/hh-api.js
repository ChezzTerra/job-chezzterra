const axios = require('axios');

const HH_API_BASE_URL = 'https://api.hh.ru/vacancies';
const TATARSTAN_AREA_ID = '1161'; // ID Республики Татарстан

// Получить все ID городов Татарстана
const getTatarstanCityIds = async () => {
  try {
    const response = await axios.get(`https://api.hh.ru/areas/${TATARSTAN_AREA_ID}`);
    const areaData = response.data;

    const cityIds = new Set();

    const traverse = (area) => {
      // Собираем только ID городов (исключаем саму республику)
      if (area.id !== TATARSTAN_AREA_ID) {
        cityIds.add(area.id);
      }

      if (area.areas && area.areas.length > 0) {
        area.areas.forEach(traverse);
      }
    };

    traverse(areaData);
    return Array.from(cityIds);

  } catch (error) {
    console.error('Ошибка при получении городов Татарстана:', error.message);
    return [];
  }
};

// Поиск вакансий только в Татарстане
const searchInTatarstan = async (profession = '', perPage = 100) => {
  try {
    // 1. Получаем все ID городов Татарстана
    const tatarstanCityIds = await getTatarstanCityIds();
    const numericTatarstanIds = tatarstanCityIds.map(Number); // Для числового сравнения

    // 2. Выполняем запрос по всем городам Татарстана
    const response = await axios.get(HH_API_BASE_URL, {
      params: {
        text: profession,
        area: tatarstanCityIds.join(','),
        per_page: perPage,
        only_with_salary: true
      },
    });

    // 3. Фильтрация результатов
    const tatarstanVacancies = response.data.items.filter(v => {
      // Проверка основной локации
      if (numericTatarstanIds.includes(v.area.id)) return true;

      // Проверка дополнительных локаций
      if (v.area.areas && v.area.areas.length > 0) {
        return v.area.areas.some(loc =>
          numericTatarstanIds.includes(loc.id)
        );
      }

      return false;
    });

    return tatarstanVacancies.map(v => ({
      id: v.id,
      name: v.name,
      city: v.area.name,
      company: v.employer.name,
      salary: v.salary
        ? `${v.salary.from || 'от ?'} - ${v.salary.to || 'до ?'} ${v.salary.currency}`
        : 'не указана',
      url: v.alternate_url,
      published: new Date(v.published_at).toLocaleDateString(),
      requirements: v.snippet.requirement || 'не указаны',
      experience: v.experience.name
    }));

  } catch (error) {
    console.error('Ошибка поиска по Татарстану:', error.message);
    return [];
  }
};

// Получить список городов Татарстана
const getTatarstanCities = async () => {
  try {
    const response = await axios.get(`https://api.hh.ru/areas/${TATARSTAN_AREA_ID}`);
    const areaData = response.data;

    const cities = [];

    const traverse = (area) => {
      // Собираем только города (исключаем саму республику)
      if (area.id !== TATARSTAN_AREA_ID) {
        cities.push({id: area.id, name: area.name});
      }

      if (area.areas && area.areas.length > 0) {
        area.areas.forEach(traverse);
      }
    };

    traverse(areaData);
    return cities;

  } catch (error) {
    console.error('Ошибка при получении городов:', error.message);
    return [];
  }
};

// Проверка работы
const testAPI = async () => {
  try {
    // Получаем список городов Татарстана
    const cities = await getTatarstanCities();
    console.log('Города Татарстана:', cities.map(c => c.name));

    // Ищем вакансии по всему Татарстану
    const vacancies = await searchInTatarstan('', 20);
    console.log(`Найдено вакансий в Татарстане: ${vacancies.length}`);

    // Проверяем наличие Москвы (должно отсутствовать)
    const hasMoscow = vacancies.some(v => v.city.includes('Москва'));
    console.log(`Содержит Москву: ${hasMoscow ? 'ДА' : 'НЕТ'}`);

    // Выводим информацию о вакансиях
    vacancies.forEach(v => {
      console.log('\n' + [
        `Должность: ${v.name}`,
        `Город: ${v.city}`,
        `Компания: ${v.company}`,
        `Зарплата: ${v.salary}`,
        `Требования: ${v.requirements ? v.requirements.substring(0, 60) + '...' : 'не указаны'}`,
        `Ссылка: ${v.url}`
      ].join('\n'));
    });

  } catch (error) {
    console.error('Ошибка в тесте:', error.message);
  }
};

// Запуск теста
testAPI();

module.exports = {
  getTatarstanCities,
  searchInTatarstan
};
