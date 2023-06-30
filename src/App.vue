<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="ui">
      <button>CLOSE</button>
    </div>
    <button>STOP</button>
    <nav>
      <RouterLink to="/">/</RouterLink>
      <RouterLink to="/config">Config</RouterLink>
      <RouterLink to="/logs">Logs</RouterLink>
    </nav>
  </header>

  <div class="main-container">
    <RouterView />
  </div>
</template>