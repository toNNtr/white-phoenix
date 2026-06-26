---
description: Компонент, который отображает открытые модальные окна.
---

<script setup lang="ts">
import { ECloseReason } from "@/api/popup";
import { BaseButton } from "@/ui/button";
import { ModalList, useModal, hasOpenedModals, closeTopModal } from "@/ui/modal";
import { modalExample } from "@docs/components";

const announcementModal = useModal(modalExample.ModalExample);
const announcementWithCloseModal = useModal(modalExample.ModalWithCloseExample);

function showAnnouncement() {
    if (!announcementModal.isOpened.value) {
        announcementModal.open();
    }
}

function showAnnouncementWithClose() {
    if (!announcementWithCloseModal.isOpened.value) {
        announcementWithCloseModal.open();
    }
}
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
import { ModalList, useModal, hasOpenedModals, closeTopModal } from "@tonntr/ui/modal";
import { ECloseReason } from "@tonntr/api/popup";

// Компонент, который будет отображаться в качестве модального окна
import { ModalExample } from "...";

const announcementModal = useModal(ModalExample);

function showAnnouncement() {
  if (!announcementModal.isOpened.value) {
    announcementModal.open();
  }
}
</script>

<template>
  <div class="backdrop" v-if="hasOpenedModals" @click="closeTopModal(ECloseReason.BACKDROP_CLICK)">
    <ModalList>
      <template #default="{ modal }">
        <component :is="modal.component" />
      </template>
    </ModalList>
  </div>
  <BaseButton @click.stop="showAnnouncement">Показать окно</BaseButton>
</template>

<style>
.backdrop {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 50%);
  z-index: 100;
}
</style>
```

**Результат**

<div class="demo demo_darkened">
    <div v-if="hasOpenedModals"
        @click="closeTopModal(ECloseReason.BACKDROP_CLICK)" style="
        position: fixed;
        display: flex;
        justify-content: center; align-items: center;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background-color: rgb(0 0 0 / 50%);
        z-index: 100;
    ">
        <ModalList>
            <template #default="{ modal }">
                <component :is="modal.component" />
            </template>
        </ModalList>
    </div>
    <BaseButton @click.stop="showAnnouncement">Показать окно</BaseButton>
</div>

Модальное окно может закрыть само себя при помощи события `close`.

```vue-html
<div class="backdrop" v-if="hasOpenedModals" @click="closeTopModal(ECloseReason.BACKDROP_CLICK)">
<ModalList>
    <template #default="{ modal }">
    <component :is="modal.component" @close="modal.close"/>
    </template>
</ModalList>
</div>
<BaseButton @click.stop="showAnnouncement">Показать окно</BaseButton>
```

**Результат**

<div class="demo demo_darkened">
    <div v-if="hasOpenedModals"
        @click="closeTopModal(ECloseReason.BACKDROP_CLICK)" style="
        position: fixed;
        display: flex;
        justify-content: center; align-items: center;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background-color: rgb(0 0 0 / 50%);
        z-index: 100;
    ">
        <ModalList>
            <template #default="{ modal }">
                <component :is="modal.component" @close="modal.close" />
            </template>
        </ModalList>
    </div>
    <BaseButton @click.stop="showAnnouncementWithClose">Показать окно</BaseButton>
</div>

## Слоты {#slots}

### По умолчанию (default) {#slots-default}

Принимает шаблон модального окна, в который помещается открываемый компонент. В самом простом случае может быть `component` с параметром `is`.

В параметрах передается объект `modal`, содержащий следующие свойства:

- component - Компонент vue, который отрисовывается в данный момент.
- id - (string) Идентификатор модального окна
- type - (string) Тип модального окна. Может быть использовано для обозначения содержимого или назначения.
- isOpened - (реактивная ссылка типа boolean) Отображается ли модальное окно в данный момент.

Также доступны другие параметры и методы элемента `Popup`.
