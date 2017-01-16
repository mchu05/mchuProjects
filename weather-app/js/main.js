$(document).ready(function(){
  $("#weekly-temp").hide();
  //auto complete call with jquery ui

 $( ".cityName" ).autocomplete({
  source: function( request, response ) {
   $.ajax({//use find
    url: "http://api.openweathermap.org/data/2.5/find",
    dataType: "jsonp",
    data: {
      q: request.term,
      APPID: "6db83b6a6c01df4fe57e77c86bc72f78",
      mode: "json"
    },
    success: function( data ) {
     
     if (typeof Array.prototype.forEach != 'function') {
         Array.prototype.forEach = function(callback){
           for (var i = 0; i < this.length; i++){
             callback.apply(this, [this[i], i, this]);
           }
         };
     }

     var parsed = data.list;
     var newArray = new Array(parsed.length);
     var i = 0;
       parsed.forEach(function (entry) {
                     var newObject = {
                         label: entry.name+" "+entry.sys.country
                     };
                     newArray[i] = newObject;
                     i++;
                 });

       response(newArray);
    },
    error: function (message) {
                 response([]);
             }
   });
  },
  minLength: 2,
  open: function() {
   $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
  },
  close: function() {
   $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
  }
 });
 
});

$(".submit").click(function(){
 $("#weekly-temp > tbody").html(''); //clear for each new search
 var city = $('.cityName').val();
 $.ajax({ //get daily forcast call
     url: "http://api.openweathermap.org/data/2.5/forecast/daily/",
     jsonp: "callback",
     dataType: "jsonp",
     data: {
         q: city,
         cnt: 7,
         units:"metric",
         mode: "json",
         APPID: "6db83b6a6c01df4fe57e77c86bc72f78"
     },
     success: function( response ) { 
        var avgAirPressure = 0;
        $("#weekly-temp").show();
        $(".arrow_box").show();
        $(".city").html('7 day forecast for: '+response.city.name);
        $(".city").append(', '+response.city.country);

        for (var i = 0; i < response.list.length; i++){
          avgAirPressure += response.list[i].pressure; //add to weekly air pressure value
          //alert(response.list[i].temp.day);
          $("#weekly-temp").find('tbody')
            .append($('<tr>')
                .append($('<td class="text-center">')
                    .append($('<span>')
                        //.attr('src', 'img.png')
                        .html(i+1)
                    )
                )
                .append($('<td>')
                    .append($('<span class="day-temp">')
                        .html(response.list[i].temp.day + '&deg;C' )
                    )
                )
                .append($('<td>')
                    .append($('<span class="min-temp">')
                        .html(response.list[i].temp.min + '&deg;C' )
                    )
                )
                .append($('<td>')
                    .append($('<span class="max-temp">')
                        .html(response.list[i].temp.max + '&deg;C' )
                    )
                )
                .append($('<td>')
                    .append($('<span class="night-temp">')
                        .html(response.list[i].temp.night + '&deg;C' )
                    )
                )
                .append($('<div class="extras arrow_box daily-temp'+ i +'">')
                    .append($('<img>')
                        .attr('src', 'http://openweathermap.org/img/w/'+ response.list[i].weather[0].icon +'.png')
                    )
                    .append($('<span class="description">')
                        .html(response.list[i].weather[0].description)
                    )
                )
            );
          // $(".arrow_box").append($('<div class="extras daily-temp'+ i+1 +'">')
          //     .append($('<img>')
          //         .attr('src', 'http://openweathermap.org/img/w/'+ response.list[i].weather[0].icon +'.png')
          //     )
          //     .append($('<span class="description">')
          //         .html(response.list[i].weather[0].description)
          //     )
          //   )
        }
        avgAirPressure = avgAirPressure/7;
        $(".air-pressure").html('Expected average air pressure for the week: <strong>'+avgAirPressure +'</strong>');
     }
 });
});