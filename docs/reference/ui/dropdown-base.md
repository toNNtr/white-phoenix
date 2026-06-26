---
description: Основа для создания раскрывающихся элементов - выпадающих списков, аккордеонов и т.д.
---

<script setup lang="ts">
    import { DropdownBase } from "@/ui/dropdown";
    import { BaseButton } from "@/ui/button";
    import { useTemplateRef } from "vue";
    import { ECloseReason } from "@/api/popup";
import { ButtonGroup } from "@/ui/button-group";

    const dropdownUsage = useTemplateRef("usageExample");
    const dropdownReason1 = useTemplateRef("reasonExample1");

    function toggleDropdownUsage() {
        dropdownUsage.value?.toggle();
    }

    function openDropdownReason1() {
      dropdownReason1.value?.open()
        .then(({reason, extraParam}) => alert(`Причина закрытия: ${reason}. Дополнительные параметры: "${extraParam}".`));
    }

    function closeDropdownReason1() {
      dropdownReason1.value?.close({ reason: ECloseReason.CLOSE, extraParam: "Любые дополнительные параметры"});
    }

</script>

# DropdownBase {#dropdown-base}

Основа для создания раскрывающихся элементов - выпадающих списков, аккордеонов и т.д.

## Подключение {#import}

```js
import { DropdownBase } from "@tonntr/white-phoenix/ui/dropdown";
```

## Использование {#usage}

```vue
<script setup>
import { DropdownBase } from "@tonntr/white-phoenix/ui/dropdown";
import { BaseButton } from "@tonntr/white-phoenix/ui/button";
import { useTemplateRef } from "vue";

const dropdown = useTemplateRef("dropdown");

function toggleDropdown() {
  dropdown.value?.toggle();
}
</script>

<template>
  <DropdownBase ref="dropdown">
    <template #controls="{ dropdownBodyId, isOpened }">
      <BaseButton @click.stop="toggleDropdown" style="width: 150px;">
        {{ isOpened ? "Свернуть" : "Раскрыть" }}
      </BaseButton>
    </template>
    <template #body>
      <p style="margin: 8px;">Теперь ты меня видишь.</p>
    </template>
  </DropdownBase>
</template>
```

**Результат**

<div class="demo demo_darkened" style="height: 150px;">
    <DropdownBase ref="usageExample">
        <template #controls="{ dropdownBodyId, isOpened }">
            <BaseButton @click.stop="toggleDropdownUsage" style="width: 150px;">
                {{ isOpened ? "Свернуть" : "Раскрыть" }}
            </BaseButton>
        </template>
        <template #body>
                <p style="margin: 8px;">
                    Теперь ты меня видишь.
                </p>
        </template>
    </DropdownBase>
</div>

## Слоты {#slots}

### controls {#slots-controls}

Можно помещать в этот слот управляющие элементы. Это необязательный к использованию слот, так как пеереключение состояния элемента происходит снаружи.

Параметры:

- dropdown-body-id - id раскрывающегося элемента. Можно передавать в aria-controls кнопки, которая переключает состояние.
- is-opened - состояние переключаемого элемента.

### body {#slots-body}

Здесь размещается контент, который должен появляться и скрываться. В отличие от [слота controls](#slots-controls), является обязательным.

## Раскрытые параметры {#exposed}

Компонент раскрывает три функции, к которым можно обращаться из родительских компонентов.

```ts
interface DropDownBase {
  toggle: () => void;
  open: () => Promise<{
      reason: ECloseReason;
  } & Partial<Record<string, unknown>>>;
  close: (params?: Partial<Record<string, unknown> | {
      reason: ECloseReason;
  }> | undefined) => void;
  ...
}
```

### toggle {#exposed-toggle}

Переключает состояние компонента.

Не принимает никаких аргументов и не возвращает никакого значения.

```js
const dropdown = useTemplateRef("dropdown");

function toggleDropdown() {
  dropdown.value?.toggle();
}
```

### open {#exposed-open}

Раскрывает компонент.

Не принимает никаких параметров. Возвращает промис, который разрешается при закрытии компонента. Промис разрешается с объектом параметров, которые были переданы при закрытии. Эти параметры включают в себя свойство `reason` - причину закрытия компонента.

```js
const dropdown = useTemplateRef("dropdown");

function openDropdown() {
  dropdown.value?.open().then(({ reason, extraParam }) =>
    alert(`
        Причина закрытия: ${reason}.
        Дополнительные параметры: "${extraParam}".
      `),
  );
}
```

**Результат**

<div class="demo demo_darkened" style="height: 150px;">
    <DropdownBase ref="reasonExample1">
        <template #controls>
        <ButtonGroup rounded style="gap: 1px;">
            <BaseButton @click.stop="openDropdownReason1" style="width: 150px;">
                Раскрыть
            </BaseButton>
            <BaseButton @click.stop="closeDropdownReason1" style="width: 150px;">
                Свернуть
            </BaseButton>
        </ButtonGroup>
        </template>
        <template #body>
                <p style="margin: 8px;">
                    Теперь ты меня видишь.
                </p>
        </template>
    </DropdownBase>
</div>

### close {#exposed-close}

Закрывает компонент.

В качестве аргумента принимает объект с параметрами:

```ts
type CloseParams = Partial<
  | Record<string, unknown>
  | {
      reason: ECloseReason;
    }
>;
```

Например,

```js
dropdown.value?.close({
  reason: ECloseReason.CLOSE,
  extraParam: "Любые дополнительные параметры",
  ...
});
```
