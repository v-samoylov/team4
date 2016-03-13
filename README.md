[![Stories in Ready](https://badge.waffle.io/urfu-2015/team4.png?label=ready&title=Ready)](https://waffle.io/urfu-2015/team4)
[![Build Status](https://travis-ci.org/urfu-2015/team4.svg?branch=master)](https://travis-ci.org/urfu-2015/team4)

# PhotoQuest 44
> 0.0.1a

![circle](https://cloud.githubusercontent.com/assets/4165695/13728695/78d6ac82-e942-11e5-8e1d-d9c456fba919.gif)

## Запуск проекта

Этот проект расчитан на запуск под `node >= 4`

Для запуска сервера (после клонирования репозитория) выполните:
```bash
npm install
npm start
```

### Окружение

По умолчанию сервер запускается в режиме development.
Для запуска с различным окружением выполните:

Unix:
```bash
export NODE_ENV=production && npm start
```
Windows:
```bash
SET NODE_ENV=production
npm start
```

### npm скрипты

*`npm start` - запуск проекта
*`npm lint:js` - проверка js (eslint)
*`npm lint:css` - проверка css (stylelint)
*`npm lint` - проверка js и css (выполняется перед push)
*`npm build` - сборка клиентского js и css (webpack)
