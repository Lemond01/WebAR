//declaracion de escena
const scene = new THREE.Scene();
scene.backgroud = new THREE.Color(0x000000);
//declaramos camara
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set (0, 2, 10);//aqui cambiamos la posicon de camara a un vector 3 xD
//inicio de patron de rendereo
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//termino de patron de rendereo
//patron de iluminacion ambiental
//agregamos luz ambiental
const ambient = new THREE.AmbientLight(0xffffff, 0.4);//color de la iluminacion e intensidad
scene.add(ambient);//se agrega a a escena
//fin de patron de luz ambiental
//patron de punto de luz
//agregamos punto de luz para generar
const point = new THREE.PointLight(0xffffff, 1);//color de la iluminacion e intensidad
point.position.set(2, 3, 2);//esto es el posicionamiento
scene.add(point);//se agrega a a escena
//fin de patron de punto de luz
//aqui generamos metodo o funcion para crear los niveles del arbolito
//rendereamos un cubo verde
function arbolNivel(y, scale){
    const geometry = new THREE.BoxGeometry(scale, scale, scale);
    const material = new THREE.MeshStandardMaterial({ color: 0x067D00 });

    const cubo = new THREE.Mesh(geometry, material);
    cubo.position.y = y;
    scene.add(cubo);
}
//construimos el tronco
const tronco = new THREE.BoxGeometry(0.7,1.5, 0.7);
const maTronco = new THREE.MeshStandardMaterial({color: 0x592200});
const troncoMesh = new THREE.Mesh(tronco, maTronco);
scene.add(tronco);
//contruimos pino
const puntaArbol = arbolNivel(0, 4);
const medioArbol = arbolNivel(1.5, 3);
const baseArbol = arbolNivel(3, 2);
//construciomos estrella a partir de un cubo amarillo
//vamos a usar esta ref
const star = new THREE.Mesh(
    new THREE.BoxGeometry(0.8,0.8,0.8),
    new THREE.MeshStandardMaterial({color: 0xF4FF00})
);
star.position.y = 4;
scene.add(star);


//animamos cubo
function animate() {
    requestAnimationFrame(animate);

    //cube.rotation.x += 0.01;
    scene.rotation.y += 0.01;//cambiar cube por scene

    renderer.render(scene, camera);
}
animate();

//Ajustamos el cubo a tamaño ventanatamaño ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();//camera.Update y debe de ser camara.update
    renderer.setSize(window.innerWidth, window.innerHeight);
});
