---
description: Компонент для группировки кнопок или других элементов в один блок
---

<script setup>
    import { ButtonGroup } from "@/ui/button-group";
    import { BaseButton } from "@/ui/button";
</script>

# ButtonGroup {#button-group}

Позволяет сгруппировать кнопки и другие элементы в один смысловой блок.

## Подключение {#import}

```js
import { ButtonGroup } from "@tonntr/white-phoenix/ui/button-group";
```

## Использование {#usage}

```vue-html
<ButtonGroup style="gap: 1px;" rounded>
    <BaseButton>Создать страницу</BaseButton>
    <BaseButton>Использовать шаблон</BaseButton>
</ButtonGroup>
```

**Результат**

<div class="demo">
    <ButtonGroup style="gap: 1px;" rounded>
        <BaseButton>Создать страницу</BaseButton>
        <BaseButton>Использовать шаблон</BaseButton>
    </ButtonGroup>
</div>

## Параметры {#props}

### element {#props-element}

Позволяет использовать конкретный элемент в качестве обертки для группы.

Например, используя элемент `nav` в комбинации с параметром [replace](./base-button#props-replace) компонента [BaseButton](./base-button) можно создать семантически корректное меню:

```vue-html
<ButtonGroup style="gap: 1px;" element="nav" rounded>
    <BaseButton
        v-for="i in 5"
        replace
    >
        <a href="#" target="_blank">Страница {{ i }}</a>
    </BaseButton>
</ButtonGroup>
```

**Результат**

<div class="demo">
    <ButtonGroup style="gap: 1px;" element="nav" rounded>
        <BaseButton
            v-for="i in 5"
            replace
        >
            <a href="#" target="_blank">Страница {{ i }}</a>
        </BaseButton>
    </ButtonGroup>
</div>

::: tip

В параметр `element` можно также передавать компонент Vue:

```vue
<script setup>
import { MyComponent } from "...";
</script>

<template>
  <ButtonGroup element="MyComponent"> ... </ButtonGroup>
</template>
```

:::

### direction {#props-direction}

Влияет на направление отрисовки вложенных элементов.

Поддерживаются два варианта:

- horizontal (по умолчанию)
- vertical

```vue-html
<ButtonGroup direction="horizontal">
    <BaseButton
        v-for="i in 5"
        replace
    >
        <a href="#" target="_blank">Страница {{ i }}</a>
    </BaseButton>
</ButtonGroup>

<ButtonGroup direction="horizontal" rounded>
    <BaseButton
        v-for="i in 5"
        replace
    >
        <a href="#" target="_blank">Страница {{ i }}</a>
    </BaseButton>
</ButtonGroup>

<ButtonGroup direction="vertical">
    <BaseButton
        v-for="i in 5"
        replace
    >
        <a href="#" target="_blank">Страница {{ i }}</a>
    </BaseButton>
</ButtonGroup>

<ButtonGroup direction="vertical" rounded>
    <BaseButton
        v-for="i in 5"
        replace
    >
        <a href="#" target="_blank">Страница {{ i }}</a>
    </BaseButton>
</ButtonGroup>
```

**Результат**

<div class="demo">
    <ButtonGroup direction="horizontal">
        <BaseButton
            v-for="i in 5"
            replace
        >
            <a href="#" target="_blank">Страница {{ i }}</a>
        </BaseButton>
    </ButtonGroup>
    <ButtonGroup direction="horizontal" rounded>
        <BaseButton
            v-for="i in 5"
            replace
        >
            <a href="#" target="_blank">Страница {{ i }}</a>
        </BaseButton>
    </ButtonGroup>
    <ButtonGroup direction="vertical">
        <BaseButton
            v-for="i in 5"
            replace
        >
            <a href="#" target="_blank">Страница {{ i }}</a>
        </BaseButton>
    </ButtonGroup>
    <ButtonGroup direction="vertical" rounded>
        <BaseButton
            v-for="i in 5"
            replace
        >
            <a href="#" target="_blank">Страница {{ i }}</a>
        </BaseButton>
    </ButtonGroup>
</div>

### rounded {#props-rounded}

Добавляет скругления к первому и к последнему элементу группы:

```vue-html
<ButtonGroup style="gap: 1px;" rounded>
    <BaseButton>Создать страницу</BaseButton>
    <BaseButton>Использовать шаблон</BaseButton>
</ButtonGroup>
```

**Результат**

<div class="demo">
    <ButtonGroup style="gap: 1px;" rounded>
        <BaseButton>Создать страницу</BaseButton>
        <BaseButton>Использовать шаблон</BaseButton>
    </ButtonGroup>
</div>

## Слоты {#slots}

### По умолчанию (default) {#slots-default}

Все элементы, помещенные в слот по умолчанию будут группироваться.

Передача содержимого через параметры компонента не поддерживается.
