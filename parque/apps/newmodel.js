const scene = new THREE.Scene();//correccion const Scene en lugar de scene
//declaramos camara
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 3;
//render de escena
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//agregamos luz ambiental
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
//agregamos punto de luz para generar
const point = new THREE.PointLight(0xffffff, 1);//me hacia falta el 0x
point.position.set(2, 3, 2);
scene.add(point);

//rendereamos un cubo 
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cuboA = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({color: 0xF4FF00})//color amarillo
);
cuboA.position.x = -2;
scene.add(cuboA);
//cubo largo
const geometryX = new THREE.BoxGeometry(2, 1, 1);
const cuboB = new THREE.Mesh(
    geometryX,
    new THREE.MeshStandardMaterial({color: 0xF4FF00})//color amarillo
);
cuboB.position.x = 0;
scene.add(cuboB);
//cubo alto
const geometryY = new THREE.BoxGeometry(1, 2, 1);
const cuboC = new THREE.Mesh(
    geometryY,
    new THREE.MeshStandardMaterial({color: 0xF4FF00})//color amarillo
);
cuboC.position.x = 2;
scene.add(cuboC);
//const material = new THREE.MeshStandardMaterial({ color: 0xFF2A00 });
//const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

//variables para UI
let rotar = true;
//cambio de color
document.getElementById("cuboColor").addEventListener("change",(e)=>{
    const colorHex = e.target.value;
    cuboA.material.color.set(colorHex);
    cuboB.material.color.set(colorHex);
    cuboC.material.color.set(colorHex);
});
//cambio de iluminación
document.getElementById("pointLight").addEventListener("input",(e)=>{
    point.intensity = parseFloat(e.target.value);
});

//activación y desactivación de rotación
document.getElementById("rotate").addEventListener("click", () =>{
    rotar = !rotar;
    document.getElementById("rotate").textContent = rotar ? "desactivar" : "activar"
}
);
//animamos cubo
function animate() {
    requestAnimationFrame(animate);
    if(rotar){
        //cuboA.rotation.x += 0.01;
        scene.rotation.y += 0.01;//cambiar cube por scene
        cuboA.rotation.y += -0.01;//rota en negativo
        cuboB.rotation.x += 0.01;//ruta positivo
        cuboC.rotation.z += -0.05;//rota negativo + velocidad

    }
    renderer.render(scene, camera);
}
animate();

//Ajustamos el cubo a tamaño ventanatamaño ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();//camera.Update y debe de ser camara.update
    renderer.setSize(window.innerWidth, window.innerHeight);
});
