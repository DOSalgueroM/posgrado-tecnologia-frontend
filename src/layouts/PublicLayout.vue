<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title class="text-center">
                    <div class="text-h6">
                        Posgrado - Facultad de Ciencias y Tecnología
                    </div>
                    <div class="text-subtitle2">
                        Universidad Mayor, Real y Pontificia de San Francisco Xavier de Chuquisaca
                    </div>
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>

        <q-footer elevated class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title class="text-center">
                    <div class="text-subtitle2">
                        {{ currentYear }} - Universidad San Francisco Xavier de Chuquisaca
                    </div>
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.q-toolbar {
    min-height: 70px;
}

.q-footer .q-toolbar {
    min-height: 50px;
}
</style>
