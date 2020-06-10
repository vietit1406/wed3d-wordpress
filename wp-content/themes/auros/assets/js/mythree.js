jQuery(document).ready(function ($) {
    if($('.woocommerce-product-gallery').length) {
        var theModel;

        //Configure 3D model
        const TRAY = document.getElementById('js-tray-slide');
        const colors = [
            {
                texture: 'http://web3d-wordpress.com/public/materials/denim_.jpg',
                size: [1, 1, 1],
                shininess: 60
            },

            {
                texture: 'http://web3d-wordpress.com/public/materials/fabric_.jpg',
                size: [1, 1, 1],
                shininess: 0
            },

            {
                texture: 'http://web3d-wordpress.com/public/materials/pattern_.jpg',
                size: [1, 1, 1],
                shininess: 10
            },

            {
                texture: 'http://web3d-wordpress.com/public/materials/quilt_.jpg',
                size: [1, 1, 1],
                shininess: 0
            },
            {
                texture: 'http://web3d-wordpress.com/public/materials/wood_.jpg',
                size: [1, 1, 1],
                shininess: 0
            },
            {
                color: '66533C'
            },
            {
                color: '173A2F'
            },
            {
                color: '153944'
            },
            {
                color: '27548D'
            },
            {
                color: '438AAC'
            }
        ];


        // Function - Build Colors
        function buildColors(colors) {
            for (let [i, color] of colors.entries()) {
                let swatch = document.createElement('div');
                swatch.classList.add('tray__swatch');
                if (color.texture) {
                    swatch.style.backgroundImage = "url(" + color.texture + ")";
                } else {
                    swatch.style.background = "#" + color.color;
                }
                swatch.setAttribute('data-key', i);
                TRAY.append(swatch);
            }
        }

        //------------------------------------------------------


        buildColors(colors);

        // Swatches
        const swatches = document.querySelectorAll(".tray__swatch");

        for (const swatch of swatches) {
            swatch.addEventListener('click', selectSwatch);
        }

        function selectSwatch(e) {
            let color = colors[parseInt(e.target.dataset.key)];
            let new_mtl;
            console.log(color.texture);
            if (color.texture) {
                // let txt = new THREE.TextureLoader().load('http://web3d-wordpress.com/public/material/wood_as1.jpg');
                let txt = new THREE.TextureLoader().load(color.texture);
                txt.repeat.set(color.size[0], color.size[1], color.size[2]);
                txt.wrapS = THREE.RepeatWrapping;
                txt.wrapT = THREE.RepeatWrapping;

                new_mtl = new THREE.MeshPhongMaterial({
                    map: txt,
                    shininess: color.shininess ? color.shininess : 10,
                });
            } else {
                new_mtl = new THREE.MeshPhongMaterial({
                    color: parseInt('0x' + color.color),
                    shininess: color.shininess ? color.shininess : 10

                });
            }

            setMaterial(theModel, new_mtl);
        }

        function setMaterial(parent, mtl) {
            parent.traverse((o) => {
                if (o.isMesh != null) {
                    o.material = mtl;
                }
            });
        }

        function setOpacity(object, opacity) {
            object.children.forEach((child) => {
                setOpacity(child, opacity);
            });
            if (object.material) {
                object.material.opacity = opacity;
            }
        };

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
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            //Load ground
            {
                const planeSize = 40;
                const loader = new THREE.TextureLoader();
                const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
                console.log(texture);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.magFilter = THREE.NearestFilter;
                const repeats = planeSize / 2;
                texture.repeat.set(repeats, repeats);

                const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
                const planeMat = new THREE.MeshPhongMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                });
                const mesh = new THREE.Mesh(planeGeo, planeMat);
                mesh.rotation.x = Math.PI * -.5;
                scene.add(mesh);
            }
            // //Load light
            var ambientight = new THREE.AmbientLight(0x20202A, 0.5, 200);
            ambientight.position.set(30, -10, 30);

            var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
            hemiLight.position.set(0, 50, 0);

            var dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position.set(-8, 12, 8).normalize();
            dirLight.castShadow = true;
            dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

            scene.add(ambientight);
            scene.add(hemiLight);
            scene.add(dirLight);


            var camera = new THREE.PerspectiveCamera(80, myWidth / myWidth * 2, 0.1, 800);
            camera.position.set(1, 1, 1);
            const canvas = document.querySelector('#my3DUrl');

            var renderer = new THREE.WebGLRenderer({antialias: true});

            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(myWidth, myWidth / 2);
            scene.background = new THREE.Color(0xffffff); // UPDATED
            renderer.toneMapping = THREE.LinearToneMapping;
            renderer.toneMappingExposure = Math.pow(0.94, 5.0);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFShadowMap;


            // window.addEventListener('resize', function () {
            //     camera.aspect = window.innerWidth / window.innerHeight;
            //     camera.updateProjectionMatrix();
            //     renderer.setSize(window.innerWidth, window.innerHeight);
            // }, false);


            //Pick model
            canvas.addEventListener('mousemove', function (event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                // raycaster.setFromCamera( mouse.clone(), camera );

                // var intersects = raycaster.intersectObjects(objects,true);
                // // console.log(intersects);
                // // console.log("After intersectObjects--------" + intersects.length);
                // if ( intersects.length > 0 ) {
                //     console.log(intersects);
                //     var oldColor=intersects[0].object.material.color;
                //     intersects[0].object.material.color.setHex(0xffffff);
                //     // var particle = new THREE.Sprite( particleMaterial );
                //     // particle.position.copy( intersects[ 0 ].point );
                //     // console.log("Mouse3 X " + intersects[ 0 ].point.x  + "          Mouse3 Y "                            +  intersects[ 0 ].point.y + "        Mouse3 Z " + intersects[ 0 ].point.z);
                //     // particle.scale.x = particle.scale.y = 16;
                //     // scene.add( particle );
                // }else{
                //     intersects[0].object.material.color=oldColor;
                // }

            }, false);

            $('body').find('#my3DUrl').html(renderer.domElement);

            function renderScene() {
                renderer.render(scene, camera);
            }

            renderCalls.push(renderScene);


            /* ////////////////////////////////////////////////////////////////////////// */
            var controls = new THREE.OrbitControls(camera, renderer.domElement);

            controls.rotateSpeed = 0.2;
            controls.zoomSpeed = 1;

            controls.minDistance = 0;
            controls.maxDistance = 20;

            controls.minPolarAngle = 0; // radians
            controls.maxPolarAngle = Math.PI / 2; // radians

            controls.enableDamping = true;
            controls.dampingFactor = 0.05;

            renderCalls.push(function () {
                controls.update();
            });

            /* ////////////////////////////////////////////////////////////////////////// */
            // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            // var cube = new THREE.Mesh( geometry, material );
            // scene.add( cube );


            /* ////////////////////////////////////////////////////////////////////////// */
            //3ds files dont store normal maps
            // var loader = new THREE.TextureLoader();
            // var normal = loader.load(url3DDirPath+"/wood_sol.jpg");
            // var normal2 = loader.load(url3DDirPath+"/credo_c1.png");

            var loader = new THREE.TDSLoader();
            // var normal = loader.load(url3DDirPath); // Unable as has a bug
            // var chairNormalMap = THREE.ImageUtils.loadTexture(url3DDirPath+"/hopsak_d.jpg");
            // loader.crossOrigin = true;
            loader.setResourcePath(url3DDirPath + '/');
            loader.load(url3D, function (object) {
                theModel = object;
                object.rotation.x -= Math.PI / 2;
                // object.rotation.setFromRotationMatrix(object.matrix);
                object.position.set(0, 0, 0); //X, Y , Z
                // object.traverse(function (child) {
                //     if (child.isMesh) {
                // //         // child.material.normalMap = normal;                    // Unable as has a bug
                // //         // var chairNormalMaterial = new THREE.MeshPhongMaterial({ map: normal });
                // //         //
                // //         // // // if this line is applied, the model will disappear
                // //         // // chairNormalMaterial.normalMap = normal;
                // //         // //
                // //         // // // if this line is applied, the normals look great but then the chair is the color of the normal map
                // //         // // chairNormalMaterial.map = normal2;
                // //         //
                // //         // child.material = chairNormalMaterial;
                //     }
                // });
                setOpacity(object, 1);
                scene.add(object);
            });


            // Show x,y,z
            axes2 = new THREE.AxisHelper(50);
            scene.add(axes2);

            //    Event Change Background Color
            $('#3dChangeBackgroundColor').on('click', function () {
                var currentColor = scene.background;
                var secondaryColor = new THREE.Color(0xffffff);

                if (JSON.stringify(currentColor) == JSON.stringify(secondaryColor)) {
                    scene.background = new THREE.Color('dimgray'); // UPDATED
                } else {
                    scene.background = new THREE.Color(0xffffff); // UPDATED
                }
            });
            $('#3dPauseCameraControl').on('click', function () {
                controls.enabled = controls.enabled === true ? false : true;
                console.log(controls.enabled);
            });
            $('.flex-viewport').css('height', 'auto');
        }, 500);
    }
//
});

