(function() {

    function strtup() {
        let peercall
        const btnCallToNode = document.querySelector('.btnCallToNode')
        const otherPeerId = document.getElementById('otherPeerId')
        btnCallToNode.addEventListener('click', ()=>{callToNode(otherPeerId.value)})
        const callinfo = document.getElementById('callinfo')
        const remVideo = document.getElementById('remVideo')
        const myVideo = document.getElementById('myVideo')

        const peer = new Peer()

        peer.on('open', function(peerID) {
			document.getElementById('myid').innerHTML=peerID;
		})

        function creatElement(teg, className = '', content = '') {
            const element = document.createElement(teg)
            className ? element.classList.add(className) : className
            element.innerText = content
            return element
        }

        peer.on('call', function(call) {
              peercall=call;
              const btnAnswer = creatElement('button', 'callanswer', 'Принять')
              const btnCancel = creatElement('button', 'callcancel', 'Отклонить')
              callinfo.appendChild(creatElement('p', '', 'Входящий звонок'))
              callinfo.appendChild(btnAnswer)
              callinfo.appendChild(btnCancel)
              btnAnswer.addEventListener('click', ()=>{callanswer()})
              btnCancel.addEventListener('click', ()=>{callcancel()})
        })

        function callanswer() {
            navigator.mediaDevices.getUserMedia ({ audio: true, video: true }).then(function(mediaStream) {
                peercall.answer(mediaStream); // отвечаем на звонок и передаем свой медиапоток собеседнику
                //peercall.on ('close', onCallClose); //можно обработать закрытие-обрыв звонка
                myVideo.srcObject = mediaStream; //помещаем собственный медиапоток в объект видео (чтоб видеть себя)
                const btnCancel = creatElement('button', 'callcancel', 'Завершить звонок')
                callinfo.innerHTML = ''
                callinfo.appendChild(creatElement('p', '', 'Звонок начат...'))
                callinfo.appendChild(btnCancel)
                myVideo.onloadedmetadata = function(e) {//запускаем воспроизведение, когда объект загружен
                    myVideo.play();
                };
                setTimeout(function() {
                    //входящий стрим помещаем в объект видео для отображения
                    remVideo.srcObject = peercall.remoteStream;
                    remVideo.onloadedmetadata= function(e) {
                    // и запускаем воспроизведение когда объект загружен
                    remVideo.play();
                    btnCancel.addEventListener('click', ()=>{callcancel()})
                    };
                },1500);

            }).catch(function(err) { console.log(err.name + ": " + err.message); });
        }

        function callcancel() {
        }

        function callToNode(peerId) { //вызов
                navigator.mediaDevices.getUserMedia ({ audio: true, video: true }).then(function(mediaStream) {
                peercall = peer.call(peerId,mediaStream); //звоним, указав peerId-партнера и передав свой mediaStream
                peercall.on('stream', function (stream) { //нам ответили, получим стрим
                    setTimeout(function() {
                    remVideo.srcObject = peercall.remoteStream;
                    remVideo.onloadedmetadata= function(e) {
                    remVideo.play();
                    };
                    },1500);
            });
            //  peercall.on('close', onCallClose);
            myVideo.srcObject = mediaStream;
            myVideo.onloadedmetadata = function(e) {
                myVideo.play();
            };
            }).catch(function(err) { console.log(err.name + ": " + err.message); });
        }
    }
    window.addEventListener('load', strtup)
}())



