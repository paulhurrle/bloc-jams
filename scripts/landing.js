var pointsArray = document.getElementsByClassName('point');

<<<<<<< HEAD
<<<<<<< HEAD
 var animatePoints = function(points) {
=======
     var points = document.getElementsByClassName('point');

>>>>>>> assignment8
     var revealPoint = function(index) {
         points[index].style.opacity = 1;
         points[index].style.transform = "scaleX(1) translateY(0)";
         points[index].style.msTransform = "scaleX(1) translateY(0)";
         points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
     };
=======
var revealPoint = function(node) {
    node.style.opacity = 1;
    node.style.transform = "scaleX(1) translateY(0)";
    node.style.msTransform = "scaleX(1) translateY(0)";
    node.style.WebkitTransform = "scaleX(1) translateY(0)";
};
>>>>>>> assignment9

 var animatePoints = function(nodeList) {
     forEach(nodeList, revealPoint);
 };

 window.onload = function() {
     if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }
     var sellingPoints = document.getElementsByClassName('selling-points')[0];
     var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
     window.addEventListener('scroll', function(event) {
         if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);
         }
     });
 }
