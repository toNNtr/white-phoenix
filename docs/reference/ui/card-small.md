---
description: Карточка с заголовком, описанием и переключаемым оверлеем
---

<script setup>
    import { CardSmall } from "@/ui/card";
    import { BaseButton } from "@/ui/button";
    import { ButtonGroup } from "@/ui/button-group";
    import { usePopup } from "@/api/popup";

    const popup = usePopup();

    function toggleOverlay() {
        popup.toggle();
    }
</script>

# CardSmall {#card-small}

## Подключение {#import}

```js
import { CardSmall } from "@tonntr/white-phoenix/ui/card";
```

## Базовое использование {#basic-usage}

```vue-html
<CardSmall title="Название страницы" description="Очень короткое описание" />
```

**Результат**

<div class="demo demo_darkened">
    <CardSmall title="Название страницы" description="Очень короткое описание" />
</div>

## Использование с оверлеем {#overlay-usage}

```vue
<script setup>
import { CardSmall } from "@tonntr/white-phoenix/ui/card";
import { BaseButton } from "@tonntr/white-phoenix/ui/button";
import { ButtonGroup } from "@tonntr/white-phoenix/ui/button-group";
import { usePopup } from "@tonntr/white-phoenix/api/popup";

const popup = usePopup();

function toggleOverlay() {
  popup.toggle();
}
</script>

<template>
  <CardSmall
    title="Название страницы"
    description="Очень короткое описание"
    :overlayVisible="popup.isOpenedRef.value"
  >
    <template #end>
      <BaseButton @click="toggleOverlay">Переключить оверлей</BaseButton>
    </template>
    <template #overlay>
      <ButtonGroup rounded style="gap: 2px;">
        <BaseButton>Действие</BaseButton>
        <BaseButton @click="toggleOverlay">Скрыть оверлей</BaseButton>
      </ButtonGroup>
    </template>
  </CardSmall>
</template>
```

**Результат**

<div class="demo demo_darkened">
    <CardSmall
        title="Название страницы"
        description="Очень короткое описание"
        :overlayVisible="popup.isOpenedRef.value"
    >
        <template #end>
            <BaseButton @click="toggleOverlay">Переключить оверлей</BaseButton>
        </template>
        <template #overlay>
            <ButtonGroup rounded style="gap: 2px;">
                <BaseButton>Действие</BaseButton>
                <BaseButton @click="toggleOverlay">Скрыть оверлей</BaseButton>
            </ButtonGroup>
        </template>
    </CardSmall>
</div>

## Параметры {#props}

### title {#props-title}

Задает заголовок карточки, а также аттрибут `aria-label`.

::: tip

Игнорируется как заголовок, если задано содержимое [слота start](#slots-start), но всё равно учитывается как `aria-label`.

:::

### description {#props-description}

Задает текстовое описание карточки.

::: tip

Игнорируется, если задано содержимое [слота center](#slots-center).

:::

### overlayVisible {#props-overlay-visible}

Определяет отображается ли в данный момент содержимое [оверлея](#slots-overlay).

## Слоты {#slots}

### start {#slots-start}

Можно использовать для добавления не текстового содержимого в заголовок карточки.

```vue-html
<CardSmall description="Очень короткое описание">
    <template #start>
        <h3>Название страницы</h3>
        <span>Создано: {{ new Date().toLocaleDateString() }}</span>
    </template>
</CardSmall>
```

**Результат**

<div class="demo demo_darkened">
    <CardSmall description="Очень короткое описание">
        <template #start>
            <h3>Название страницы</h3>
            <span>Создано: {{ new Date().toLocaleDateString() }}</span>
        </template>
    </CardSmall>
</div>

### center {#slots-center}

Можно использовать для добавления не текстового содержимого в центр карточки.

```vue-html
<CardSmall title="Название страницы">
    <template #center>
        <ButtonGroup rounded style="gap: 1px;">
            <BaseButton>Редактировать</BaseButton>
            <BaseButton>Удалить</BaseButton>
        </ButtonGroup>
    </template>
</CardSmall>
```

**Результат**

<div class="demo demo_darkened">
    <CardSmall title="Название страницы">
        <template #center>
            <ButtonGroup rounded style="gap: 1px;">
                <BaseButton>Редактировать</BaseButton>
                <BaseButton>Удалить</BaseButton>
            </ButtonGroup>
        </template>
    </CardSmall>
</div>

### end {#slots-end}

Можно использовать для добавления контента в конец карточки.

```vue-html
<CardSmall title="Название страницы">
    <template #end>
        <ButtonGroup rounded style="gap: 1px;">
            <BaseButton>Редактировать</BaseButton>
            <BaseButton>Удалить</BaseButton>
        </ButtonGroup>
    </template>
</CardSmall>
```

**Результат**

<div class="demo demo_darkened">
    <CardSmall title="Название страницы">
        <template #end>
            <ButtonGroup rounded style="gap: 1px;">
                <BaseButton>Редактировать</BaseButton>
                <BaseButton>Удалить</BaseButton>
            </ButtonGroup>
        </template>
    </CardSmall>
</div>

### overlay {#slots-overlay}

Содержит дополнительные элементы, которые отображаются только при включенном параметре [overlayVisible](#props-overlay-visible).

```vue-html
<CardSmall
    overlayVisible
    title="Заголовок"
    description="Оверлей скрывает только часть контента"
>
    <template #overlay>
        <ButtonGroup direction="horizontal" rounded style="gap: 1px;">
            <BaseButton>Редактировать</BaseButton>
        </ButtonGroup>
    </template>
</CardSmall>
```

**Результат**

<div class="demo demo_darkened">
    <CardSmall
        overlayVisible
        title="Заголовок"
        description="Оверлей скрывает только часть контента"
    >
        <template #overlay>
            <ButtonGroup direction="horizontal" rounded style="gap: 1px;">
                <BaseButton>Редактировать</BaseButton>
            </ButtonGroup>
        </template>
    </CardSmall>
</div>
