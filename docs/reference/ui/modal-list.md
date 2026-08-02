---
description: Компонент, который отображает открытые модальные окна.
---

<script setup lang="ts">
import { ECloseReason } from "@/api/popup";
import { BaseButton } from "@/ui/button";
import { ModalList, ModalWidget, useModal } from "@/ui/modal";
import { modalExample } from "@docs/components";
import { ref } from "vue";

const announcementModal = useModal(modalExample.ModalExample);
const announcementWithCloseModal = useModal(modalExample.ModalWithCloseExample);
let exampleOneCloseReason = ref<ECloseReason | null>(null);
let exampleTwoCloseReason = ref<ECloseReason | null>(null);

function showAnnouncement() {
    announcementModal.open();
}

function showAnnouncementWithClose() {
    announcementWithCloseModal.open();
}

announcementModal.onClosed((reason) => {
    exampleOneCloseReason.value = reason ?? null;
});

announcementWithCloseModal.onClosed((reason) => {
    exampleTwoCloseReason.value = reason ?? null;
});
</script>

# ModalList {#modal-list}

Компонент, который отображает открытые модальные окна.

## Подключение {#import}

```js
import { ModalList } from "@tonntr/ui/modal";
```

## Использование {#usage}

```vue
<script setup>
import { ModalList, ModalWidget, useModal } from "@tonntr/ui/modal";

// Компонент, который будет отображаться в качестве модального окна
import { ModalExample } from "...";

const announcementModal = useModal(ModalExample);

function showAnnouncement() {
  announcementModal.open();
}
</script>

<template>
  <ModalList>
    <template #default="{ modal }">
      <ModalWidget :id="modal.id" @close="modal.close" :modal="modal" />
    </template>
  </ModalList>
  <BaseButton @click.stop="showAnnouncement">Показать окно</BaseButton>
</template>
```

**Результат**

<div class="demo demo_darkened">
    <ModalList>
        <template #default="{ modal }">
            <ModalWidget :id="modal.id" @close="modal.close" :modal="modal" />
        </template>
    </ModalList>
    <BaseButton @click.stop="showAnnouncement">Показать окно</BaseButton>
    <span v-if="exampleOneCloseReason">Причина закрытия: <mark>{{ exampleOneCloseReason }}</mark></span>
</div>

Модальное окно может закрыть само себя при помощи события `close`.

```vue-html
    <ModalList>
        <template #default="{ modal }">
            <ModalWidget :id="modal.id" @close="modal.close" :modal="modal" />
        </template>
    </ModalList>
    <BaseButton @click.stop="showAnnouncement">Показать окно</BaseButton>
```

**Результат**

<div class="demo demo_darkened">
    <ModalList>
        <template #default="{ modal }">
            <ModalWidget :id="modal.id" @close="modal.close" :modal="modal" />
        </template>
    </ModalList>
    <BaseButton @click.stop="showAnnouncementWithClose">Показать окно</BaseButton>
    <span v-if="exampleTwoCloseReason">Причина закрытия: <mark>{{ exampleTwoCloseReason }}</mark></span>
</div>

## Слоты {#slots}

### По умолчанию (default) {#slots-default}

Принимает шаблон модального окна, в который помещается открываемый компонент. В самом простом случае может быть `component` с параметром `is`.

В параметрах передается объект `modal`, содержащий следующие свойства:

- component - Компонент vue, который отрисовывается в данный момент.
- id - (string) Идентификатор модального окна
- type - (string) Тип модального окна. Одновременно может быть открыто только одно модальное окно каждого типа. Если открывается новое окно, а другое с таким же типом уже было открыто, открытое окно закроется с причиной `ECloseReason.ANOTHER_OPENED`.
- isOpenedRef - (реактивная ссылка типа boolean) Отображается ли модальное окно в данный момент.

Также доступны другие параметры и методы элемента `Popup`.
