export const WrappedData = {
    "genres" : {},
    "actors" : {},
    "actresses" : {},
    "directors" : {},
    "first_movie" : { "data": null, "date": null },
    "last_movie" : {  "data": null, "date": null },
    "first_show" : { "data": null, "date": null },
    "last_show" : { "data": null, "date": null },
    "total_movies" : 0,
    "total_shows" : 0,
    "total_episodes" : 0,
    "total_time_movies" : 0,
    "total_time_shows" : 0,
}

export function ClearData() {
    WrappedData.genres = {}
    WrappedData.actrors = {}
    WrappedData.actresses = {}
    WrappedData.directors = {}
    WrappedData.first_movie.data = null
    WrappedData.first_movie.date = null
    WrappedData.last_movie.data = null
    WrappedData.last_movie.date = null
    WrappedData.first_show.data = null
    WrappedData.first_show.date = null
    WrappedData.last_show.data = null
    WrappedData.last_show.date = null
    WrappedData.total_movies = 0
    WrappedData.total_shows = 0
    WrappedData.total_episodes = 0
    WrappedData.total_time_movies = 0
    WrappedData.total_time_shows = 0
}

export function printData() {
    console.table(WrappedData.genres)
    // console.table(WrappedData.actors)
    // console.table(WrappedData.actresses)
    // console.table(WrappedData.directors)
    console.log(`First movie: ${WrappedData.first_movie.data?.title} (${WrappedData.first_movie.data?.last_updated_at_trakt.split('T')[0]})`)
    console.log(`Last movie: ${WrappedData.last_movie.data?.title} (${WrappedData.last_movie.data?.last_updated_at_trakt.split('T')[0]})`)
    console.log(`First show: ${WrappedData.first_show.data?.name} (${WrappedData.first_show.data?.last_updated_at_trakt.split('T')[0]})`)
    console.log(`Last show: ${WrappedData.last_show.data?.name} (${WrappedData.last_show.data?.last_updated_at_trakt.split('T')[0]})`)
    console.log('Total movies: ', WrappedData.total_movies)
    console.log('Total shows: ', WrappedData.total_shows)
    console.log('Total episodes: ', WrappedData.total_episodes)
    console.log('Total time movies: ', WrappedData.total_time_movies)
    console.log('Total time shows: ', WrappedData.total_time_shows)
    console.log('Total time: ', WrappedData.total_time_movies + WrappedData.total_time_shows)
}