# Формочки by Savi (Bootstrap snippet)

## Использование:

1) Берёте шаблон из exampleForm, сохраняя структуру. <br />
2) выбираете только нужные вам типы инпутов. <br />
3) И подключаете на странице скрипт, где есть строчка:
```
var validator = require('../../lib/forms/forms');

$(function () {
    validator.init();
});
```
