// server/index.js
const { searchInYakutia, getYakutiaCities, getVacanciesByCity } = require('./vacancyModule');

// Поиск по всем параметрам
app.get('/api/vacancies', async (req, res) => {
  const { query, perPage } = req.query;
  const results = await searchInYakutia(query, perPage);
  res.json(results);
});

// Получение городов
app.get('/api/cities', (req, res) => {
  res.json(getYakutiaCities());
});

// Получение вакансий по городу
app.get('/api/vacancies/:city', async (req, res) => {
  const { city } = req.params;
  const { perPage } = req.query;
  const results = await getVacanciesByCity(city, perPage);
  res.json(results);
});
