---
description: Базовый компонент самой обычной кнопки
---

<script setup>
    import { BaseButton } from "@lib/ui/button";
</script>

<style>
    .icon-inside-button {
        padding: 4px;
        background-color: #ccc;
        border-radius: 4px;
    }
</style>

# BaseButton {#base-button}

## Подключение {#import}

```js
import { BaseButton } from `@tonntr/white-phoenix/ui/button`;
```

## Использование {#usage}

### variety: primary {#usage-primary}

Используется по умолчанию:

```vue-html
<BaseButton>Primary button</BaseButton>
```

, либо можно указать явно:

```vue-html
<BaseButton variety="primary">Also primary button</BaseButton>
```

**Результат**

<div class="demo">
    <BaseButton>Primary button</BaseButton>
</div>

### variety: outline {#usage-outline}

::: warning

Эта вариация пока в разработке.

:::

```vue-html
<BaseButton variety="outline">Outline button</BaseButton>
```

**Результат**

<div class="demo">
    <BaseButton variety="outline">Outline button</BaseButton>
</div>

## Параметры {#props}

### text {#props-text}

Устанавливает текстовое содержимое кнопки.

::: tip

Игнорируется, если задано содержимое [слота по умолчинию](#slots-default) или если используется параметр [replace](#props-replace).

:::

### variety {#props-variety}

Используется для выбора стилизации кнопки.

Доступные варианты:

- "primary" (см. [variety: Primary](#usage-primary)),
- "outline" (см. [variety: Outline](#usage-outline)).

### replace {#props-replace}

Позволяет стилизовать другой элемент как кнопку, при этом не изменяя его поведения.

::: tip

При использовании этого параметра содержимое кнопки можно задать только через [слот по умолчинию](#slots-default). Параметр [text](#props-text) будет игнорироваться.

:::

Например, если нужно отобразить ссылку как кнопку:

```vue-html
<BaseButton replace>
    <a href="#">Создать страницу</a>
</BaseButton>
```

**Результат**

<div class="demo">
    <BaseButton replace>
        <a href="#" target="_blank">Создать страницу</a>
    </BaseButton>
</div>

## Слоты {#slots}

### По умолчанию (default) {#slots-default}

В слот по умолчанию можно помещать элементы, которые должны отобразиться внутри кнопки.

Внутреннее содержимое кнопки будет располагаться в ряд с отступом 4px.

```vue-html
<BaseButton>
  <div class="icon-inside-button">🎉</div>
  <span>Эта кнопка шикарна!</span>
</BaseButton>
```

**Результат**

<div class="demo">
    <BaseButton>
        <div class="icon-inside-button">🎉</div>
        <span>Эта кнопка шикарна!</span>
    </BaseButton>
</div>
