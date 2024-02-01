<script>
  export let data;
</script>

<div class="flex flex-col items-center justify-center">
  <div class="">
    <form class="flex gap-4 text-black justify-center mb-6">
      <input
        name="search"
        type="text"
        class="px-3 py-2 rounded-md"
        value={data.search}
        placeholder="Search for movies"
      />
      <button class="bg-white px-6 py-2 rounded-md">Search</button>
    </form>

    <ul class="py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {#each data.movies as movie (movie.id)}
        <li>
          <a href={movie.url} target="_blank" class="flex flex-col items-center gap-4">
            <img
              src={movie.imageUrl}
              class="aspect-[90/133] w-32 rounded-md overflow-hidden object-cover"
              alt={movie.title}
            />
            <h3 class="text-center">{movie.title}</h3>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>
