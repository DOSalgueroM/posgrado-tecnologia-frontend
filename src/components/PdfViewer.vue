<template>
    <div style="height: 90vh; display: flex; flex-direction: column;">
        <iframe :src="pdfUri" style="flex: 1; width: 100%; border: none;" frameborder="0">
        </iframe>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
    pdfUri: {
        type: String,
        required: true,
    },
});
</script>