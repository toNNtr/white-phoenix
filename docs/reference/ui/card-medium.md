---
description: Карточка с заголовком, описанием и переключаемым оверлеем
---

<script setup>
    import { CardMedium } from "@/ui/card";
    import { BaseButton } from "@/ui/button";
    import { ButtonGroup } from "@/ui/button-group";
    import { usePopup } from "@/api/popup";

    const popup = usePopup();

    function toggleOverlay() {
        popup.toggle();
    }
</script>

# CardMedium {#card-medium}

## Подключение {#import}

```js
import { CardMedium } from "@tonntr/white-phoenix/ui/card";
```

## Базовое использование {#basic-usage}

```vue-html
<CardMedium title="Шаблон страницы" description="Шаблон главной страницы сайта" />
```

**Результат**

<div class="demo demo_darkened">
    <CardMedium title="Шаблон страницы" description="Шаблон главной страницы сайта" />
</div>

## Использование с оверлеем {#overlay-usage}

```vue
<script setup>
import { CardMedium } from "@tonntr/white-phoenix/ui/card";
import { BaseButton } from "@tonntr/white-phoenix/ui/button";
import { ButtonGroup } from "@tonntr/white-phoenix/ui/button-group";
import { usePopup } from "@tonntr/white-phoenix/api/popup";

const popup = usePopup();

function toggleOverlay() {
  popup.toggle();
}
</script>

<template>
  <CardMedium
    title="Шаблон страницы"
    description="Шаблон главной страницы сайта"
    :overlayVisible="popup.isOpenedRef.value"
  >
    <template #headerTop>
      <BaseButton @click="toggleOverlay">Переключить оверлей</BaseButton>
    </template>
    <template #overlay>
      <ButtonGroup direction="vertical" style="gap: 2px; justify-content: space-between;">
        <BaseButton v-for="i in 2">Действие {{ i }}</BaseButton>
        <BaseButton @click="toggleOverlay">Скрыть оверлей</BaseButton>
      </ButtonGroup>
    </template>
  </CardMedium>
</template>
```

**Результат**

<div class="demo demo_darkened">
    <CardMedium
        title="Шаблон страницы"
        description="Шаблон главной страницы сайта"
        :overlayVisible="popup.isOpenedRef.value"
    >
        <template #headerTop>
            <BaseButton @click="toggleOverlay">Переключить оверлей</BaseButton>
        </template>
        <template #overlay>
            <ButtonGroup direction="vertical" style="gap: 2px; justify-content: space-between;">
                <BaseButton v-for="i in 2">Действие {{ i }}</BaseButton>
                <BaseButton @click="toggleOverlay">Скрыть оверлей</BaseButton>
            </ButtonGroup>
        </template>
    </CardMedium>
</div>

## Параметры {#props}

### title {#props-title}

Задает заголовок карточки, а также аттрибут `aria-label`.

::: tip

Игнорируется как заголовок, если задано содержимое [слота header](#slots-header), но всё равно учитывается как `aria-label`.

:::

### description {#props-description}

Задает текстовое описание карточки.

::: tip

Игнорируется, если задано содержимое [слота description](#slots-description).

:::

### overlayVisible {#props-overlay-visible}

Определяет отображается ли в данный момент содержимое [оверлея](#slots-overlay).

## Слоты {#slots}

### headerTop {#slots-header-top}

С помощью этого слота можно добавить содержимое в верхнюю часть карточки над заголовком.

Занимает место даже, если в слоте ничего нет.

```vue-html
<CardMedium ...>
    <template #headerTop>
        <BaseButton>Переключить оверлей</BaseButton>
    </template>
</CardMedium>
```

### header {#slots-header}

Можно использовать для добавления не текстового содержимого в заголовок карточки.

```vue-html
<CardMedium ...>
    <template #header>
        <h3>Шаблон страницы</h3>
        <BaseButton>Редактировать</BaseButton>
    </template>
</CardMedium>
```

**Результат**

<div class="demo demo_darkened">
    <CardMedium description="Шаблон главной страницы">
        <template #header>
            <h3>Шаблон страницы</h3>
            <BaseButton>Редактировать</BaseButton>
        </template>
    </CardMedium>
</div>

### description {#slots-description}

Можно использовать для добавления не текстового содержимого в описание карточки.

```vue-html
<CardMedium title="Шаблон страницы">
    <template #description>
        <ButtonGroup rounded style="gap: 1px;">
            <BaseButton>Создать страницу</BaseButton>
            <BaseButton>Редактировать</BaseButton>
        </ButtonGroup>
    </template>
</CardMedium>
```

**Результат**

<div class="demo demo_darkened">
    <CardMedium title="Шаблон страницы">
        <template #description>
            <ButtonGroup rounded style="gap: 1px;">
                <BaseButton>Создать страницу</BaseButton>
                <BaseButton>Редактировать</BaseButton>
                <BaseButton>Удалить</BaseButton>
            </ButtonGroup>
        </template>
    </CardMedium>
</div>

### overlay {#slots-overlay}

Содержит дополнительные элементы, которые отображаются только при включенном параметре [overlayVisible](#props-overlay-visible).

```vue-html
<CardMedium
    overlayVisible
    title="Заголовок скрыт оверлеем"
    description="Описание тоже"
>
    <template #overlay>
        <ButtonGroup direction="vertical" style="gap: 8px;">
            <BaseButton>Создать страницу</BaseButton>
            <BaseButton>Редактировать</BaseButton>
        </ButtonGroup>
    </template>
</CardMedium>
```

**Результат**

<div class="demo demo_darkened">
    <CardMedium
        overlayVisible
        title="Заголовок скрыт оверлеем"
        description="Описание тоже"
    >
        <template #overlay>
            <ButtonGroup direction="vertical" style="gap: 8px;">
                <BaseButton>Создать страницу</BaseButton>
                <BaseButton>Редактировать</BaseButton>
            </ButtonGroup>
        </template>
    </CardMedium>
</div>
