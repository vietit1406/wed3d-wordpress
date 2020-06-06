jQuery(document).ready(function ($) {
    var url3D = $('#my3DUrl').attr('href');
    var url3DDirPath = $('#my3DUrl').data('dir');
    setTimeout(function () {
        var myWidth = $('#my3DUrl').parent().width();
        /*////////////////////////////////////////*/
        var renderCalls = [];

        function render() {
            requestAnimationFrame(render);
            renderCalls.forEach((callback) => {
                callback();
            });
        }

        render();

        /*////////////////////////////////////////*/

        var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 800);
        camera.position.set(1, 1, 1);
        const canvas = document.querySelector('#my3DUrl');
        var renderer = new THREE.WebGLRenderer({antialias: true});

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(myWidth, myWidth);
        scene.background = new THREE.Color(0xf0f0f0); // UPDATED
        renderer.toneMapping = THREE.LinearToneMapping;
        renderer.toneMappingExposure = Math.pow(0.94, 5.0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        // document.body.appendChild( renderer.domElement);
        // document.body.$(canvas);
        $('body').find('#my3DUrl').html(renderer.domElement);

        function renderScene() {
            renderer.render(scene, camera);
        }

        renderCalls.push(renderScene);

        /* ////////////////////////////////////////////////////////////////////////// */
        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        controls.rotateSpeed = 0.2;
        controls.zoomSpeed = 0.5;

        controls.minDistance = 2;
        controls.maxDistance = 20;

        controls.minPolarAngle = 0; // radians
        controls.maxPolarAngle = Math.PI / 2; // radians

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        renderCalls.push(function () {
            controls.update()
        });

        /* ////////////////////////////////////////////////////////////////////////// */
        // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // var cube = new THREE.Mesh( geometry, material );
        // scene.add( cube );

        var light = new THREE.PointLight(0xffffcc, 20, 200);
        light.position.set(4, 30, -20);
        scene.add(light);

        var light2 = new THREE.AmbientLight(0x20202A, 20, 100);
        light2.position.set(30, -10, 30);
        scene.add(light2);

        /* ////////////////////////////////////////////////////////////////////////// */
        var loader = new THREE.TDSLoader();
        // var normal = loader.load(url3DDirPath); // Unable as has a bug

        // loader.crossOrigin = true;
        loader.setResourcePath(url3DDirPath + '/');
        loader.load(url3D, function (object) {
            object.rotation.x -= Math.PI / 2;
            // object.rotation.setFromRotationMatrix(object.matrix);
            object.position.set(0, 0, 0); //X, Y , Z
            object.traverse(function (child) {
                if (child.isMesh) {
                    // child.material.normalMap = normal; // Unable as has a bug
                }
            });
            scene.add(object);
        });

        //Show x,y,z
        // axes2 = new THREE.AxisHelper( 50 );
        // scene.add( axes2 );

        //    Event Change Background Color
        $('#3dChangeBackgroundColor').on('click', function () {
            let sceneBg = scene.background;
            if (sceneBg.b || sceneBg.r || sceneBg.g) {
                scene.background = new THREE.Color(0x000000); // UPDATED
            } else {
                scene.background = new THREE.Color(0xf0f0f0); // UPDATED
            }

        });
        $('.flex-viewport').css('height', 'auto');
    }, 500);
//
});

