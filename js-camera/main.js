(function () {
    let width = 320
    let height = 0

    let streaming = false

    let video = null
    let canvas = null
    let photo = null
    let statbutton = null
    let selectFilter = document.getElementById('filter')

    function startup() {
        video = document.getElementById('video')
        canvas = document.getElementById('canvas')
        photo = document.getElementById('photo')
        statbutton = document.getElementById('statbutton')

        navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function(stream){
          video.srcObject = stream;
          video.play();
        })
        .catch(function(err){
          console.log(err)
        })

        video.addEventListener('canplay', function(ev){
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth/width);

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
          }
        }, false);

        startbutton.addEventListener('click', function(ev){
          takepicture();
          ev.preventDefault();
        }, false);

        clearphoto();
    }

    function clearphoto() {
        const context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
      }

      function takepicture() {
        const context = canvas.getContext('2d');
        if (width && height) {
          canvas.width = width;
          canvas.height = height;
          context.drawImage(video, 0, 0, width, height);

          var data = canvas.toDataURL('image/png');
          photo.setAttribute('src', data);
        } else {
          clearphoto();
        }
      }

      window.addEventListener('load', startup, false);

      selectFilter.addEventListener('change', function() {
        function setFilter(filter) {
          video.style.filter = filter
          canvas.style.filter = filter
        }
        const selectedIndex = selectFilter.selectedIndex
        switch (selectedIndex) {
          case 0:
            setFilter('')
            break;
          case 1:
            setFilter('blur(1px)')
            break;
          case 2:
            setFilter('brightness(0.4)')
            break;
          case 3:
            setFilter('contrast(200%)')
            break;
          case 4:
            setFilter('grayscale(50%)')
            break;
          case 5:
            setFilter('hue-rotate(90deg)')
            break;
          case 6:
            setFilter('invert(75%)')
            break;
          case 7:
            setFilter('opacity(25%)')
            break;
          case 8:
            setFilter('saturate(30%)')
            break;
          case 9:
            setFilter('sepia(60%)')
            break;

          default:
            break;
        }
      })
      
})();