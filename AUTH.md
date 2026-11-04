# Внутренние аккаунты 0.7

Регистрация: логин 3–32 символа, пароль 10–128. Логин приводится к NFKC и нижнему регистру. Пароль: Node crypto scrypt, N=16384, r=8, p=5, соль 16 байт, результат 32 байта. Такой профиль указан в [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html); runtime — [Cloudflare node:crypto](https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/).

Сессия — случайные 32 байта, в D1 только SHA-256, срок 30 дней. Production cookie __Host-ss_session: Secure, HttpOnly, SameSite=Lax, Path=/. На loopback HTTP используется отдельная dev-cookie. Код восстановления — 24 случайных байта; в D1 только SHA-256. Восстановление заменяет пароль и код, отзывает старые сессии. Пользователь должен сохранить код; отправки email нет.

POST требует JSON и совпадающий Origin, тело ограничено 4096 байт. Лимиты за 15 минут: 30 запросов по хешированному IP и 8 по хешированному логину. Неизвестный логин тоже выполняет scrypt. Сохранения читаются и меняются только по внутренней сессии. Platform identity разрешает только явное добровольное копирование старого прогресса при регистрации.

Таблицы: accounts, account_sessions, auth_limits, game_progress. Миграция 0001 добавляет первые три, существующая 0000 не меняется. CAS защищает прогресс от перезаписи параллельной вкладкой. Пароли и recovery-коды не журналируются. Реальные production-аккаунты при QA не создаются.
