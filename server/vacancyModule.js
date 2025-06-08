// vacancyModule.js

// База данных вакансий (в реальном проекте заменить на подключение к API или БД)
const vacanciesDB = [
  {
    id: 1,
    title: "Разработчик React Native",
    company: "IT Компания Якутск",
    salary: "от 100 000 руб.",
    city: "Якутск",
    experience: "1-3 года",
    description: "Разработка мобильных приложений для крупных проектов республики"
  },
  {
    id: 2,
    title: "Backend разработчик (Node.js)",
    company: "Якутские Технологии",
    salary: "от 120 000 руб.",
    city: "Якутск",
    experience: "3+ года",
    description: "Разработка серверной части для систем мониторинга"
  },
  {
    id: 3,
    title: "Геолог",
    company: "Алроса",
    salary: "от 140 000 руб.",
    city: "Мирный",
    experience: "2+ года",
    description: "Поиск и оценка месторождений алмазов"
  },
  {
    id: 4,
    title: "Врач-терапевт",
    company: "Городская больница №1",
    salary: "от 90 000 руб.",
    city: "Нерюнгри",
    experience: "5+ лет",
    description: "Амбулаторный прием пациентов в поликлинике"
  },
  {
    id: 5,
    title: "Учитель английского языка",
    company: "Гимназия №2",
    salary: "от 85 000 руб.",
    city: "Ленск",
    experience: "Без опыта",
    description: "Преподавание английского языка в средней школе"
  }
];

// Основная функция поиска вакансий
const searchInYakutia = async (query = "", perPage = 50) => {
  try {
    // Нормализация запроса
    const normalizedQuery = query.toLowerCase().trim();

    // Фильтрация вакансий
    let results = vacanciesDB;

    if (normalizedQuery) {
      results = results.filter(vacancy =>
        vacancy.title.toLowerCase().includes(normalizedQuery) ||
        vacancy.description.toLowerCase().includes(normalizedQuery) ||
        vacancy.company.toLowerCase().includes(normalizedQuery)
      );
    }

    // Ограничение количества результатов
    return results.slice(0, perPage);

  } catch (error) {
    console.error("Ошибка при поиске вакансий:", error);
    return [];
  }
};

// Функция для получения списка городов с вакансиями
const getYakutiaCities = () => {
  // Получаем уникальные города из базы
  const cities = new Set(vacanciesDB.map(vacancy => vacancy.city));
  return Array.from(cities);
};

// Функция для получения вакансий по конкретному городу
const getVacanciesByCity = async (city, perPage = 50) => {
  const normalizedCity = city.toLowerCase().trim();

  return vacanciesDB
    .filter(vacancy => vacancy.city.toLowerCase() === normalizedCity)
    .slice(0, perPage);
};

module.exports = {
  searchInYakutia,
  getYakutiaCities,
  getVacanciesByCity  // Добавим новую полезную функцию
};
