---
description: Компонент для отрисовки каталогов
---

<script setup>
    import { onMounted, ref, useTemplateRef } from "vue";
    import { BaseCatalog } from "@lib/ui/catalog";
    import { CardSmall, CardMedium } from "@lib/ui/card";
    import { BaseButton } from "@lib/ui/button";
    import { ButtonGroup } from "@lib/ui/button-group";

    const usageItems = [
        { id: 0, title: "Страница 1", description: "Очень короткое описание" },
        { id: 1, title: "Страница 2", description: "Очень короткое описание" },
        { id: 2, title: "Страница 3", description: "Очень короткое описание" },
        { id: 3, title: "Страница 4", description: "Очень короткое описание" },
        { id: 4, title: "Страница 5", description: "Очень короткое описание" },
    ];

    function usageWithDelegationItems() {
        return new Promise(resolve => setTimeout(() => resolve([
            { id: 0, title: "Страницы", description: "Асинхронная загрузка" },
            { id: 1, title: "Загруженные", description: "начинается в момент" },
            { id: 2, title: "С сервера", description: "монтирования каталога" },
        ]), 3000));
    }

    const showUsageWithDelegation = ref(false);
    const observerTargetDelegation = useTemplateRef("observerTargetDelegation");
    const observerCallbackDelegation = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                showUsageWithDelegation.value = true;
                observerDelegation.unobserve(observerTargetDelegation.value);
            }
        });
    };

    const observerDelegation = new IntersectionObserver(observerCallbackDelegation, {
        root: null,
        threshold: .1,
    });

    onMounted(() => {
        observerDelegation.observe(observerTargetDelegation.value);
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

const items = [
  { id: 0, title: "Страница 1", description: "Очень короткое описание" },
  { id: 1, title: "Страница 2", description: "Очень короткое описание" },
  { id: 2, title: "Страница 3", description: "Очень короткое описание" },
  { id: 3, title: "Страница 4", description: "Очень короткое описание" },
  { id: 4, title: "Страница 5", description: "Очень короткое описание" },
];
</script>

<template>
  <BaseCatalog title="Страницы" :items="items" layout="horizontal">
    <template #card="{ item }">
      <CardSmall :title="item.title" :description="item.description" />
    </template>
  </BaseCatalog>
</template>
```

**Результат**

<div class="demo demo_darkened">
    <BaseCatalog title="Страницы" :items="usageItems" layout="horizontal">
        <template #card="{ item }">
            <CardSmall :title="item.title" :description="item.description"/>
        </template>
    </BaseCatalog>
</div>

## Делегирование загрузки списка {#usage-with-delegation}

Можно делегировать компоненту загрузку списка передав в параметрах асинхронную функцию, которая будет возвращать загруженные данные. Компонент вызовет эту функцию как только будет смонтирован.

```vue
<script setup>
import { BaseCatalog } from "@tonntr/white-phoenix/ui/catalog";
import { CardSmall } from "@tonntr/white-phoenix/ui/card";

async function loadData() {
  const response = await fetch("...");
  if (!response.ok) {
    throw "Не удалось загрузить данные";
  }

  return await response.json();
}
</script>

<template>
  <BaseCatalog title="Страницы" :get-items="loadData" layout="horizontal">
    <template #card="{ item }">
      <CardSmall :title="item.title" :description="item.description" />
    </template>
  </BaseCatalog>
</template>
```

**Результат**

<div
    v-if="showUsageWithDelegation"
    class="demo demo_darkened"
    style="
        height: 280px;
        overflow-y: auto;
    "
>
    <BaseCatalog title="Страницы" :get-items="usageWithDelegationItems" layout="horizontal">
        <template #card="{ item }">
            <CardSmall :title="item.title" :description="item.description"/>
        </template>
    </BaseCatalog>
</div>
<div ref="observerTargetDelegation"></div>

::: tip

Подробнее про использование параметра getItems и требованиям к функции, возвращающей данные смотрите в разделе [getItems](#props-get-items).

:::

## Параметры {#props}

### title {#props-title}

Заголовок каталога.

::: tip

Игнорируется как заголовок, если задано содержимое [слота header](#slots-header), но всё равно учитывается как `aria-label`.

:::

### layout {#props-layout}

Задает раскладку элементов каталога.

Возможные значения:

- grid
- horizontal

### items {#props-items}

Массив элементов для отображения в каталоге.

Каждый элемент должен обязательно содержать поле "id", которое должно быть уникальным.

```vue-html
const items: { id: symbol | string | number }[] = [...];
```

::: tip

Игнорируется, если передан [параметр get-items](#props-get-items).

:::

### get-items {#props-get-items}

Принимает асинхронную функцию, которая должна вернуть массив элементов для отображения каталога.

```ts
function getItems(params: {
    filter?: {
        searchWord?: string | undefined;
    } | undefined;
    paging?: {
        page?: number | undefined;
        maxItems?: number | undefined;
    } | undefined;
}): Promise<{ id: string | number | symbol }[]>{
    ...
}
```

Таким образом можно [делегировать](#usage-with-delegation) получение данных компоненту каталога.

## Слоты {#slots}

### header {#slots-header}

Позволяет добавлять не текстовое содержимое в заголовок каталога.

```vue-html
<BaseCatalog>
    <template #header>
        <div style="
            display: flex;
            justify-content: space-between;
            gap: 8px;
        ">
            <h2>Шаблоны страниц</h2>
            <BaseButton>Создать</BaseButton>
        </div>
    </template>
</BaseCatalog>
```

**Результат**

<div class="demo demo_darkened">
    <BaseCatalog>
        <template #header>
            <h2>Шаблоны страниц</h2>
            <BaseButton>Создать</BaseButton>
        </template>
    </BaseCatalog>
</div>

### card {#slots-card}

Принимает шаблон для отображения в качестве элемента каталога.

Параметры:

- item - элемент каталога

```vue-html
<BaseCatalog :items="usageItems">
    <template #card="{ item }">
        <CardMedium :title="item.title" :description="item.description" />
    </template>
</BaseCatalog>
```

**Результат**

<div class="demo demo_darkened">
    <BaseCatalog :items="usageItems">
        <template #card="{ item }">
            <CardMedium :title="item.title" :description="item.description" />
        </template>
    </BaseCatalog>
</div>
