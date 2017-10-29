log-viewer
==========

Для правильной работы, ссылка на директориб `app` или `angular\log_viewer_ang\app` должна быть `http:host/log`

Данная ссылка исползуется в проекте `cr_desk`

## Журналы с WebSocketDS

Обращение производится через директорию `http:host/cr_conf/log_viewer/log_from_tango_web_auth.php` к таблице в БД `tango_web_auth`.`command_history`. Данная таблица содержит историю команд, сохраняемую из танго-девайса WebSocketDS.

Также долЫжна содержаться таблица `tango_web_auth`.`device_list` содержащая Список танго устройств заносящих данные в журнал.

## Установка необходимых программ

Для правильной работы должны быть установлены `npm`,  `bower`,  `nodejs`

```bash
sudo apt-get install nodejs
sudo apt-get install nodejs-legacy
sudo apt-get install npm

```

После устновки nodejs дла загрузки bower необходимо запустить команду:

```bash
sudo npm install -g bower
```

## Загрузка директорий

Команда для загрузки всех необходимых директорий:

```bash
bower install
```