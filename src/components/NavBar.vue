<script setup lang="ts">
</script>

<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <RouterLink to="/TopStories" class="logo-link">Search <br/>Hacker News</RouterLink>
    </div>
    <div class="navbar-links">
      <RouterLink to="#" class="nav-link">All</RouterLink>
      <RouterLink to="/TopStories" class="nav-link">Hot</RouterLink>
      <RouterLink to="#" class="nav-link">Show HN</RouterLink>
      <RouterLink to="#" class="nav-link">Ask HN</RouterLink>
      <RouterLink to="#" class="nav-link">Polls</RouterLink>
      <RouterLink to="#" class="nav-link">Jobs</RouterLink>
      <RouterLink to="#" class="nav-link">Shipow</RouterLink>
      <RouterLink to="#" class="nav-link">Starred</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  height: 100px;
  background: rgb(255, 255, 255);
  font-family: 'Roboto', sans-serif;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); 
  border-radius: 10px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-logo .logo-link {
  font-size: 20px;
  font-weight: 700;
  color: rgb(238, 146, 25);
  text-decoration: none;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: color 0.3s ease, transform 0.3s ease;
}

.navbar-logo .logo-link:hover {
  color: #f1f1f1;
  transform: scale(1.1);
}

.navbar-links {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center; 
}

.navbar-links .nav-link {
  font-size: 16px;
  font-weight: 500;
  color: rgb(202, 202, 202);
  text-decoration: none;
  text-transform: capitalize;
  transition: color 0.3s ease, transform 0.3s ease;
  padding: 10px 15px;
  border-radius: 5px;
  position: relative;
}

.navbar-links .nav-link:hover {
  color: #ffeb3b; 
  transform: translateY(-3px); 
}

.navbar-links .nav-link:active {
  transform: translateY(1px); 
}


.navbar-links .nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0%;
  height: 2px;
  background-color: #ffeb3b;
  transition: width 0.3s ease, left 0.3s ease;
}

.navbar-links .nav-link:hover::after {
  width: 100%;
  left: 0;
}

</style>
