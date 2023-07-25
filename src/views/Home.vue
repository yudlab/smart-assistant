<template>
  <form class="p-5" @submit.prevent="onSubmit">
    <div class="flex items-center">
      <input v-model="textQuery" class="text-teal-100 text-2xl appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Ask me something" aria-label="Enter your search">
      <button class="text-2xl flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
        {{ textQuery == "" ? "Record" : "Send" }}
      </button>
      <button class="text-2xl flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="reset">
        Reset
      </button>
    </div>
  </form>
  <img :src="imageUrl" alt="img" class="fixed"/>
  <Recorder />
</template>

<script setup>
  import { ref } from 'vue';
  const textQuery = ref('')
  import imageUrl from '@/assets/img/bg.jpg';
  import Recorder from '@/components/Recorder.vue';

  const onSubmit = async (e) => {
    if(textQuery.value == "") {
      //record
    } else {
      console.log(textQuery.value)
      await sendQuery({ query: textQuery.value})
        .then((response) => {
          console.log(response)
        });
    }
  }

  const sendQuery = async (data) => {
  // Default options are marked with *
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/query`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
</script>