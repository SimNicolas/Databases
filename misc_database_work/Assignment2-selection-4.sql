#1 Find all films with maximum length or minimum rental duration (compared to all other films). 
#In other words let L be the maximum film length, and let R be the minimum rental duration in the table film. You need to find all films that have length L or duration R or both length L and duration R.
#You just need to return attribute film id for this query. 

SELECT film_id FROM film
WHERE length = (SELECT MAX(length) FROM film)
OR rental_duration = (SELECT MIN(rental_duration) FROM film);


#2 We want to find out how many of each category of film ED CHASE has started in so return a table with category.name and the count
#of the number of films that ED was in which were in that category order by the category name ascending (Your query should return every category even if ED has been in no films in that category).
--use left join to retain correct previous category information from join
SELECT c.name, COUNT(a.actor_id)
FROM category c
LEFT JOIN film_category fc ON fc.category_id = c.category_id
LEFT JOIN film f ON f.film_id = fc.film_id
LEFT JOIN film_actor fa ON fa.film_id = f.film_id
LEFT JOIN actor a ON a.actor_id = fa.actor_id 
WHERE a.first_name = "ED" AND a.last_name = "CHASE"
GROUP BY c.name;


#3 Find the first name, last name and total combined film length of Sci-Fi films for every actor
#That is the result should list the names of all of the actors(even if an actor has not been in any Sci-Fi films)and the total length of Sci-Fi films they have been in.
--https://stackoverflow.com/questions/40563985/sql-find-the-first-name-last-name-and-total-combined-film-length-of-sci-fi-fi
--Right join is to include all actors in a sci fi movie as well as not in a sci fi movie
--The link above helped me realize this because I always ended up with just actors in sci-fi movies (not all actors)
SELECT a.first_name, a.last_name, SUM(f.length)
FROM category c
INNER JOIN film_category fc ON fc.category_id = c.category_id AND c.name = "Sci-Fi"
INNER JOIN film f ON f.film_id = fc.film_id
INNER JOIN film_actor fa ON fa.film_id = f.film_id
RIGHT JOIN actor a ON a.actor_id = fa.actor_id
GROUP BY a.first_name, a.last_name;



#4 Find the first name and last name of all actors who have never been in a Sci-Fi film
SELECT a.first_name, a.last_name 
FROM actor a
INNER JOIN film_actor fa ON fa.actor_id = a.actor_id
INNER JOIN film f ON f.film_id = fa.film_id
INNER JOIN film_category fc ON fc.film_id = fa.film_id
INNER JOIN category c ON c.category_id = fc.category_id
WHERE c.name NOT IN (SELECT name FROM category WHERE name = "Sci-Fi")
GROUP BY a.first_name;


#5 Find the film title of all films which feature both KIRSTEN PALTROW and WARREN NOLTE
#Order the results by title, descending (use ORDER BY title DESC at the end of the query)
#Warning, this is a tricky one and while the syntax is all things you know, you have to think oustide
#the box a bit to figure out how to get a table that shows pairs of actors in movies

SELECT f.title FROM film f
INNER JOIN film_actor fa ON fa.film_id = f.film_id
INNER JOIN actor a ON a.actor_id = fa.actor_id
WHERE a.actor_id = (
	SELECT actor_id FROM actor WHERE first_name = "KIRSTEN" AND last_name = "PALTROW")
AND (SELECT actor_id FROM actor WHERE first_name = "WARREN" AND last_name = "NOLTE")
ORDER BY f.title DESC;







