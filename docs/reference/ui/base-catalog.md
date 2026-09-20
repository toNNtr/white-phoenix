---
description: Компонент для отрисовки каталогов
---

<script setup>
    import { onMounted, ref, useTemplateRef } from "vue";
    import { BaseCatalog } from "@/ui/catalog";
    import { CardSmall, CardMedium } from "@/ui/card";
    import { BaseButton } from "@/ui/button";
    import { ButtonGroup } from "@/ui/button-group";
    import { CardMediumLoader } from "@docs/components/laoder";

    function fetchItems() {
        return new Promise(resolve => setTimeout(() => resolve({
            items: [
                { id: 0, title: "Страница 1", description: "Очень короткое описание" },
                { id: 1, title: "Страница 2", description: "Очень короткое описание" },
                { id: 2, title: "Страница 3", description: "Очень короткое описание" },
                { id: 3, title: "Страница 4", description: "Очень короткое описание" },
                { id: 4, title: "Страница 5", description: "Очень короткое описание" },
            ],
        }), 1500));
    }

    function endlessFetchItems() {
        return new Promise(resolve => {
            // Never resolve
        })
    }
    
    function fetchWithError() {
        return Promise.reject(new Error("Текст ошибки при неудачной загрузке данных."));
    }

    const showUsage = ref(false);
    const observerTargetUsage = useTemplateRef("observerTargetUsage");
    const observerCallbackUsage = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                showUsage.value = true;
                observerUsage.unobserve(observerTargetUsage.value);
            }
        });
    };

    const observerUsage = new IntersectionObserver(observerCallbackUsage, {
        root: null,
        threshold: 0.1,
    });

    onMounted(() => {
        observerUsage.observe(observerTargetUsage.value);
    });
</script>

# BaseCatalog

## Подключение {#import}

```js
import { BaseCatalog } from "@tonntr/white-phoenix/ui/catalog";
```

## Использование {#usage}

```vue
<script setup>
import { BaseCatalog } from "@tonntr/white-phoenix/ui/catalog";
import { CardSmall } from "@tonntr/white-phoenix/ui/card";

async function fetchItems() {
  return {
    items: [
      { id: 0, title: "Страница 1", description: "Очень короткое описание" },
      { id: 1, title: "Страница 2", description: "Очень короткое описание" },
      { id: 2, title: "Страница 3", description: "Очень короткое описание" },
      { id: 3, title: "Страница 4", description: "Очень короткое описание" },
      { id: 4, title: "Страница 5", description: "Очень короткое описание" },
    ],
  };
}
</script>

<template>
  <BaseCatalog
    layout="vertical"
    :get-items="fetchItems"
    #="{ item }"
  >
    <CardSmall
      :title="item.title"
      :description="item.description"
    />
  </BaseCatalog>
</template>
```

**Результат**

<div
    v-if="showUsage"
    class="demo demo_darkened"
    style="
        height: 280px;
        overflow-y: auto;
    "
>
    <BaseCatalog
        layout="vertical"
        :get-items="fetchItems"
        #="{ item }"
    >
        <CardSmall :title="item.title" :description="item.description"/>
    </BaseCatalog>
</div>
<div ref="observerTargetUsage"></div>

## Параметры {#props}

### layout {#props-layout}

Задает раскладку элементов каталога.

Возможные значения:

- grid
- vertical

### get-items {#props-get-items}

Принимает асинхронную функцию, которая должна вернуть определение каталога. В определении каталога должен содержаться список элементов для отображения, также могут быть добавлены другие параметры, необходимые для пагинации.

```ts
type GetCatalogItemsMethod<T> = (params: {
  filter?:
    | {
        searchWord?: string | undefined;
      }
    | undefined;
  sorting?:
    | {
        [x: string]: "asc" | "desc";
      }
    | undefined;
  paging?:
    | {
        page?: number | undefined;
        maxItems?: number | undefined;
      }
    | undefined;
}) => Promise<{
  items: T[];
  totalItems?: number | undefined;
  page?: number | undefined;
}>;
```

**Параметры метода:**

- filter - используется для передачи в метод поискового запроса и фильтров;
- sorting - сиписок полей по которым осуществляется сортировка и направление сортировки;
- paging - параметры пагинации (текущая страница и максималькое количество элементов на странице).

**Возвращаемое значение:**

- items - список элементов каталога для отрисовки;
- totalItems - общее количество элементов каталога с учетом тех, которые не были возвращены с сервера и с учетом фильтрации;
- page - возвращенная сервером страница (может быть полезно, если в момент пагинации на сервере изменились данные из-за чего страниц стало меньше).

## Слоты {#slots}

### default {#slots-default}

Принимает шаблон для отображения в качестве элемента каталога.

Параметры:

- item - элемент каталога;
- catalogItems - все элементы каталога на странице;
- totalItems - общее количество элементов каталога с учетом тех, которые не были возвращены с сервера и с учетом фильтрации;
- page - возвращенная сервером страница (может быть полезно, если в момент пагинации на сервере изменились данные из-за чего страниц стало меньше).

```vue-html
<BaseCatalog :get-items="fetchItems">
    <template #default="{ item, catalogItems, totalItems, page }">
        <CardMedium :title="item.title" :description="item.description" />
    </template>
</BaseCatalog>
```

### loader {#slots-loader}

Принимает лоадер для отрисовки во время загрузки данных.

Для наглядности, в следующем примере функция fetchItems никогда не возвращает данные, что позволяет вечно наблюдать за загрузкой:

```vue-html
<BaseCatalog :get-items="fetchItems">
    <template #default="{ item }">
        <CardMedium :title="item.title" :description="item.description" />
    </template>
    <template #loader>
        <CardMediumLoader />
        <CardMediumLoader />
        <CardMediumLoader />
    </template>
</BaseCatalog>
```

<div class="demo demo_darkened">
    <BaseCatalog :get-items="endlessFetchItems">
        <template #default="{ item }">
            <CardMedium :title="item.title" :description="item.description" />
        </template>
        <template #loader>
            <CardMediumLoader />
            <CardMediumLoader />
            <CardMediumLoader />
        </template>
    </BaseCatalog>
</div>

### error {#slots-error}

Принимает содержимое, которое должно отобразиться в случае, если при загрузке данных произошла ошибка.

Параметры:

- error - текст ошибки.

```vue-html
<BaseCatalog :get-items="fetchItems">
    <template #default="{ item }">
        <CardMedium :title="item.title" :description="item.description" />
    </template>
    <template #error="{ error }">
        <CardMedium
            title="Произошла ошибка"
            :description="error"
            style="background-color: #ff000063;"
        />
    </template>
</BaseCatalog>
```

<div class="demo demo_darkened">
    <BaseCatalog :get-items="fetchWithError">
        <template #default="{ item }">
            <CardMedium :title="item.title" :description="item.description" />
        </template>
        <template #error="{ error }">
            <CardMedium title="Произошла ошибка" :description="error" style="background-color: #ff000063;" />
        </template>
    </BaseCatalog>
</div>
