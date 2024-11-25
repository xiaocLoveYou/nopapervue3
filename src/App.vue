<template>
    <div>
        <router-link to="/"></router-link>
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    name: 'App',
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
html {
    background-color: #EAEDF1;
}
</style>
