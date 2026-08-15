---
description: Плагин для работы с HTTP-запросами
---

# HTTP {#http}

Плагин HTTP позволяет делать HTTP-запросы привычным образом,
при этом добавляет новый функционал, такой как мокирование ответов,
предоставление общих заголовков или базового URL.

## Установка {#install}

```js
import http from "@tonntr/white-phoenix/plugins/http";

createApp(App).use(http, pluginOptions);
```

### Опции плагина {#install-options}

Плагин поддерживает следующие опции:

- mockRequests - Включает мокирование ответов;
- base - Базовый URL, который добавляется ко всем запросам;
- headers - Общие заголовки, которые добавляются ко всем запросам;

### Определение API {#install-define-api}

Перед выполнением запросов необходимо определить пользовательский API.
Для этого используется функция `defineApi`.
Эта функция позволяет определить методы API вне контекста Vue и возвращает функцию-генератор, которую можно использовать для создания экземпляра API.

Пример определения API:

::: code-group

```js [@/pages/api]
import { defineApi } from "@tonntr/white-phoenix/plugins/http";

export const usePagesApi = defineApi("pages", ({http}) => {
    http.mock(...);

    async function getPages(options) {
        const response = await http.fetch("/.../...", {
            method: "get",
            headers: { ... },
        });

        if(!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();

        return data;
    }

    return { getPages };
});
```

:::

`defineApi` принимает идентификатор пользовательского API и setup-функцию.

setup-функция вызывается в момент создания экземпляра API с опциями:

- http - экземпляр плагина;

Созданный экземпляр API будет содержать все методы, которые вернет setup-функция.

### Создание экземпляра API {#install-create-api}

Экземпляр API создается с помощью функции-генератора, которую вернул вызов `defineApi`.

::: warning

Создавать экземпляр API следует в окружении Vue, либо внутри функции, которая будет вызвана в окружении Vue. Это необходимо, потому что в момент создания экземпляра API вызывается setup-функция, в которую передается экземпляр плагина.

:::

::: code-group

```vue [@/pages/ui/PagesList.vue]
<script setup>
import { usePagesApi } from "@/pages/api";

/** Создание экземпляра API */
const pagesApi = usePagesApi();

/** Вызов метода API */
pagesApi.getPages(...).then(...);
</script>
```

:::

### Использование без определения API {#usage-without-api}

Если предполагается выполнение запросов только внутри компонентов Vue, определять API не обязательно.

Плагин предоставляет свой экземпляр глобально. Из любого компонента можно получить к нему доступ используя `inject`:

```vue
<script setup>
import { inject } from "vue";
/** Необходимо импортировать ключ */
import { httpKey } from "@tonntr/white-phoenix/plugins/http";

const http = inject(httpKey);

/** Далее можно использовать все возможности плагина */
http.mock(...);
http.fetch(...);
...
</script>
```

## Отправка запросов {#request}

По большей части, отправка запросов происходит таким же образом, как и через функцию `fetch`, только через экземпляр плагина:

```js
http.fetch("api/endpoint", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: "Data to send to server...",
});
```

Функция `http.fetch` возвращает тот же объект `Response`, что и обычная функция `fetch`.

Разница будет заключаться в том, что используя плагин необязательно указывать полный адрес ресурса или все заголовки при каждом запросе.

Например, предположим, что в проекте есть переменная окружения, которая содержит адрес API-сервера, а в каждом запросе нужно указывать один и тот же заголовок:

```js
// main.js
import http from "@tonntr/white-phoenix/plugins/http";

createApp(...).use(http, {
    base: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/x-www-urlencoded",
    },
});

// @/pages/api
export const defineApi("pages", ({http}) => {
    function getPages() {
        return http.fetch(
            /** Эквивалент `${import.meta.env.VITE_API_URL}/pages` */
            "/pages",
            {
                method: "get",
                /** В запрос будут добавлены заголовки: "Content-Type", "Accept" */
                headers: {
                    "Accept": "application/json",
                },
            }
        ).then(response => response.json());
    }

    function createPage(pageOptions) {
        return http.fetch(
            /** Эквивалент `${import.meta.env.VITE_API_URL}/pages` */
            "/pages",
            {
                method: "post",
                headers: {
                    /** Можно переопределить заголовок, установленный глобально */
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(pageOptions),
            }
        ).then(response => response.json());
    }

    return { getPages, createPage };
});
```

## Мокирование ответов {#mocking}

Чтобы включить мокирование ответов сервера нужно передать `mockRequests: true` в параметры плагина:

```js
import http from "@tonntr/white-phoenix/plugins/http";

createApp(...).use(http, { mockRequests: true });
```

Экземпляр плагина предоставляет функцию `mock`, с помощью которой можно определить моковый ответ.

Например, в setup-функции при определении API:

```js
defineApi("mocking-responses", ({ http }) => {
  http.mock("/api/pages", {
    method: "get",
    delay: 500,
    data: "Данные, которые как будто бы вернул сервер",
  });
});
```

Если нужно имитировать обработку передаваемых параметров, в `data` можно передать функцию, возвращающую результат. В качестве параметра, она примет запрос:

```js
defineApi("mocking-responses", ({ http }) => {
  http.mock("/api/pages", {
    method: "post",
    delay: 500,
    data(request) {
      console.log(request.url); // '/api/pages'
      console.log(request.searchParams); // URLSearchParams {size: 1}
      console.log(request.method); // "post"
      console.log(request.headers); // { "Content-Type": "application/json" }
      console.log(request.body); // '{ "a": 4, "b": 7 }'

      const body = JSON.parse(request.body);
      return { sum: body.a + body.b };
    },
  });

  http
    .fetch("/api/pages?userId=12345", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a: 4, b: 7 }),
    })
    .then((response) => response.json())
    .then((data) => console.log(data.sum)); // 11
});
```

Для каждого HTTP-метода можно определить свой моковый ответ:

```js
defineApi("mocking-responses", ({ http }) => {
  http.mock("/api/pages", {
    method: "get",
    delay: 500,
    data: "Mocked GET",
  });

  http.mock("/api/pages", {
    method: "post",
    delay: 500,
    data: "Mocked POST",
  });

  http
    .fetch("/api/pages", {
      method: "get",
    })
    .then((response) => response.text())
    .then((data) => console.log(data)); // "Mocked GET"

  http
    .fetch("/api/pages", {
      method: "post",
    })
    .then((response) => response.text())
    .then((data) => console.log(data)); // "Mocked POST"
});
```

Можно не определять метод. Тогда моковый ответ будет возвращаться для любого подходящего адреса без учета метода запроса:

```js
defineApi("mocking-responses", ({ http }) => {
  http.mock("/api/pages", {
    delay: 500,
    data({ method }) {
      return { data: `Mocked ${method.loUpperCase()}` };
    },
  });

  http
    .fetch("/api/pages", {
      method: "get",
    })
    .then((response) => response.text())
    .then((data) => console.log(data)); // "Mocked GET"

  http
    .fetch("/api/pages", {
      method: "post",
    })
    .then((response) => response.text())
    .then((data) => console.log(data)); // "Mocked POST"
});
```
