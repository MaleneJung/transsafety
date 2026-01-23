<script setup lang="ts">
import { Route, ROUTER } from '@/core/router'
</script>

<template>
  <button @click="ROUTER.go(Route.Unlocked)">Create</button>
</template>
