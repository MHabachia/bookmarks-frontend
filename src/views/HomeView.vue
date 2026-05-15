<template>
  <!-- HomeView ist absichtlich einfach gehalten.
       Das Layout (Sidebar + Topbar) liegt in App.vue,
       der eigentliche Inhalt kommt von BookmarkList. -->
  <BookmarkList />
</template>

<script setup>
import BookmarkList from '../components/BookmarkList.vue'
</script>
