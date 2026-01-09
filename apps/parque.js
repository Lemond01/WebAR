const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 5, 10);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const point = new THREE.PointLight(0xffffff, 1);
point.position.set(2, 5, 2);
scene.add(point);

const floorGeo = new THREE.PlaneGeometry(20, 20);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

const pathGeo = new THREE.PlaneGeometry(20, 3);
const pathMat = new THREE.MeshStandardMaterial({ color: 0xA0A0A0 });
const camino = new THREE.Mesh(pathGeo, pathMat);
camino.rotation.x = -Math.PI / 2;
camino.position.set(0, -0.99, 0);
scene.add(camino);

function crearBanca(x, z) {
    const asiento = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.3, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    asiento.position.set(x, -0.5, z);

    const pata1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.5, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x5A3A1E })
    );
    pata1.position.set(x - 0.8, -0.9, z);

    const pata2 = pata1.clone();
    pata2.position.x = x + 0.8;

    scene.add(asiento, pata1, pata2);
}

crearBanca(-4, 2);
crearBanca(4, -1);

function crearArbusto(x, z) {
    const arbusto = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x2ECC71 })
    );
    arbusto.position.set(x, -0.8, z); 
    scene.add(arbusto);
}

crearArbusto(-3, -3);
crearArbusto(2, -4);
crearArbusto(4, 3);

function crearArbol(x, z) {
    const tronco = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 2),
        new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    tronco.position.set(x, 0, z);

    const copa = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x1E7A1E })
    );
    copa.position.set(x, 1.5, z);

    scene.add(tronco, copa);
}

crearArbol(-5, -2);
crearArbol(5, 2);
crearArbol(0, 4);

function crearRoca(x, z, escala = 1) {
    const rocaGeo = new THREE.IcosahedronGeometry(1, 0);
    const rocaMat = new THREE.MeshStandardMaterial({ color: 0x7A7A7A });
    const roca = new THREE.Mesh(rocaGeo, rocaMat);

    roca.scale.set(escala, escala * 0.7, escala);
    roca.position.set(x, -0.8, z);

    scene.add(roca);
}

crearRoca(-2, 3, 0.6);
crearRoca(3, -2, 0.9);
crearRoca(-4, -4, 1.2);

function crearCercaLinea(x1, x2, z, saltoEntrada = null) {
    const postes = [];
    const madera = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const posteGeo = new THREE.BoxGeometry(0.2, 1, 0.2);

    for (let x = x1; x <= x2; x += 2) {
        if (saltoEntrada !== null && Math.abs(x - saltoEntrada) < 1.5) {
            continue;
        }
        const poste = new THREE.Mesh(posteGeo, madera);
        poste.position.set(x, -0.5, z);
        postes.push(poste);
    }

    const tablaGeo = new THREE.BoxGeometry((x2 - x1), 0.2, 0.15);

    const tabla1 = new THREE.Mesh(tablaGeo, madera);
    tabla1.position.set((x1 + x2) / 2, -0.3, z);

    const tabla2 = new THREE.Mesh(tablaGeo, madera);
    tabla2.position.set((x1 + x2) / 2, 0.3, z);

    scene.add(...postes, tabla1, tabla2);
}


crearCercaLinea(-9, 9, -9, 0);


crearCercaLinea(-9, 9, 9);

let rotar = true;

document.getElementById("rotate").addEventListener("click", () => {
    rotar = !rotar;
    document.getElementById("rotate").textContent = rotar ? "desactivar" : "activar";
});

function animate() {
    requestAnimationFrame(animate);
    if (rotar) scene.rotation.y += 0.003;
    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
