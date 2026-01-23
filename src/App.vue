<script setup lang="ts">
import { Route, ROUTER, routeState } from './core/router'
import SafeListView from './views/SafeListView.vue'
import SafeCreateView from './views/SafeCreateView.vue'
import SafeUnlockedView from './views/SafeUnlockedView.vue'
</script>

<template>
  <div id="wrapper">
    <div id="header">
      <h1 @click="ROUTER.go(Route.List)">Transsafety</h1>
    </div>
    <div id="current-view">
      <SafeListView v-if="routeState === Route.List" />
      <SafeCreateView v-else-if="routeState === Route.Create" />
      <SafeUnlockedView v-else-if="routeState === Route.Unlocked" />
      <p v-else>ERROR: Unknown Route</p>
    </div>
  </div>
</template>

<style scoped>
#wrapper {
  background-color: #222228;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

#header {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 3rem;
  padding: 1rem;
  background: linear-gradient(135deg, #00bbff88, #ff00bb88);
  border-bottom: #111114 1px solid;
  backdrop-filter: blur(4px);
}

#header h1 {
  color: #bbbbbb;
  cursor: pointer;
}

#header h1:hover {
  color: #ffffff;
}

#current-view {
  margin-top: 5rem;
}
</style>
