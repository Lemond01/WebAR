// ============================================
// APLICACIÓN THREE.JS - CUBOS 3D INTERACTIVOS
// ============================================

// Variables globales
let scene, camera, renderer, controls;
let cubes = [];
let globalSpeed = 0.5;
let axisSpeed = 1.0;
let cubeColor = 0x3498db;
let lightColor = 0xffffff;

// Variables para transición suave
let targetGlobalSpeed = 0.5;
let currentGlobalSpeed = 0.5;
const SPEED_TRANSITION_SPEED = 0.05;

// Referencia a la luz principal
let mainLight = null;

// Inicializar aplicación
function init() {
    console.log("Inicializando Three.js...");
    
    // 1. CREAR ESCENA CON FONDO GRIS OSCURO
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    console.log("Escena creada con fondo gris oscuro");
    
    // 2. CONFIGURAR CÁMARA - AJUSTADA PARA 6 CUBOS
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    
    // Ajustar posición para ver todos los cubos
    camera.position.set(0, 3, 15);
    camera.lookAt(0, 0, 0);
    console.log("Cámara configurada para vista amplia");
    
    // 3. CREAR RENDERIZADOR
    const container = document.getElementById('scene-container');
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    console.log("Renderizador WebGL listo");
    
    // 4. CONTROLES DE CÁMARA - AJUSTADOS
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 8;
        controls.maxDistance = 40;
        controls.maxPolarAngle = Math.PI;
        controls.target.set(0, 0, 0);
        console.log("Controles de cámara activados");
    }
    
    // 5. SISTEMA DE ILUMINACIÓN MEJORADO
    setupLighting();
    
    // 6. CREAR 6 CUBOS CON DIFERENTES DIMENSIONES
    createCubes();
    
    // 7. CONFIGURAR INTERFAZ
    setupUI();
    
    // 8. MANEJAR REDIMENSIONAMIENTO
    window.addEventListener('resize', onWindowResize);
    
    // 9. INICIAR ANIMACIÓN
    animate();
    
    console.log("Aplicación 3D lista! 6 Cubos con diferentes dimensiones");
}

// CONFIGURAR ILUMINACIÓN MEJORADA
function setupLighting() {
    // Luz principal desde la derecha
    mainLight = new THREE.DirectionalLight(lightColor, 1.5);
    mainLight.position.set(15, 20, 10);
    mainLight.castShadow = true;
    
    // Configurar sombras
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.left = -25;
    mainLight.shadow.camera.right = 25;
    mainLight.shadow.camera.top = 25;
    mainLight.shadow.camera.bottom = -25;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    
    scene.add(mainLight);
    
    // Luz ambiental
    const ambient = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambient);
    
    // Luz de relleno desde izquierda
    const fillLight = new THREE.DirectionalLight(0x303030, 0.3);
    fillLight.position.set(-10, 10, 5);
    scene.add(fillLight);
    
    console.log("Sistema de iluminación configurado");
}

// CREAR 6 CUBOS CON DIFERENTES DIMENSIONES
function createCubes() {
    // Limpiar cubos existentes
    cubes.forEach(cube => scene.remove(cube));
    cubes = [];
    
    // Configuración de 6 cubos con diferentes dimensiones
    // Algunos son rectangulares (no perfectamente cúbicos)
    const cubeConfigs = [
        // Primeros 3 cubos (similares a los originales)
        { width: 1.5, height: 1.5, depth: 1.5, initialX: -5, orbitRadius: 5, yOffset: 0, rotationSpeed: 1.0 },
        
        { width: 2.0, height: 2.0, depth: 2.0, initialX: 0, orbitRadius: 5, yOffset: 1, rotationSpeed: 0.8 },
        
        { width: 1.0, height: 1.0, depth: 1.0, initialX: 5, orbitRadius: 5, yOffset: 0, rotationSpeed: 1.2 },
        
        // 3 CUBOS NUEVOS CON FORMAS DIFERENTES
        // Cubo rectangular (más ancho que alto)
        { width: 2.5, height: 1.0, depth: 1.5, initialX: -7, orbitRadius: 7, yOffset: -1, rotationSpeed: 1.1 },
        
        // Cubo muy grande y delgado
        { width: 3.0, height: 0.5, depth: 3.0, initialX: 7, orbitRadius: 7, yOffset: 1.5, rotationSpeed: 0.7 },
        
        // Cubo pequeño pero alto (como una columna)
        { width: 0.8, height: 3.0, depth: 0.8, initialX: 0, orbitRadius: 9, yOffset: -2, rotationSpeed: 1.4 }
    ];
    
    // Crear cada cubo usando BoxGeometry con dimensiones personalizadas
    cubeConfigs.forEach((config, index) => {
        // Crear geometría del cubo con dimensiones específicas
        const geometry = new THREE.BoxGeometry(config.width, config.height, config.depth);
        
        // Crear material con variaciones de color basadas en el índice
        const hueVariation = (index * 40) % 360;
        const baseColor = cubeColor;
        const material = new THREE.MeshPhongMaterial({
            color: baseColor,
            shininess: 70 + (index * 5),
            specular: 0x333333,
            emissive: 0x000000,
            flatShading: false
        });
        
        // Crear mesh (objeto 3D)
        const cube = new THREE.Mesh(geometry, material);
        
        // Posicionar cubo inicialmente
        cube.position.set(config.initialX, config.yOffset, 0);
        
        // Guardar propiedades adicionales para la animación
        cube.userData = {
            orbitRadius: config.orbitRadius,
            initialX: config.initialX,
            yOffset: config.yOffset,
            rotationMultiplier: config.rotationSpeed,
            currentAngle: (index - 3) * (Math.PI / 4), // Distribuir en diferentes ángulos
            timeOffset: index * 0.5,
            angleOffset: (index - 3) * (Math.PI / 4),
            orbitSpeed: 0.5
        };
        
        // Habilitar sombras
        cube.castShadow = true;
        cube.receiveShadow = true;
        
        // Añadir a la escena
        scene.add(cube);
        cubes.push(cube);
        
        console.log(`Cubo ${index + 1} creado - Dimensiones: ${config.width}x${config.height}x${config.depth}`);
    });
    
    console.log("6 Cubos 3D creados con diferentes dimensiones y formas");
}

// CONFIGURAR INTERFAZ DE USUARIO
function setupUI() {
    console.log("Configurando interfaz de usuario...");
    
    // 1. Selector de color para cubos
    const colorPicker = document.getElementById('cube-color');
    colorPicker.value = '#3498db';
    cubeColor = 0x3498db;
    
    colorPicker.addEventListener('input', (e) => {
        const hexColor = e.target.value;
        cubeColor = parseInt(hexColor.replace('#', '0x'), 16);
        
        // Actualizar color de todos los cubos
        cubes.forEach(cube => {
            cube.material.color.setHex(cubeColor);
        });
        
        console.log(`Color de cubos cambiado a: ${hexColor}`);
    });
    
    // 2. Selector de color para iluminación (NUEVO)
    const lightColorPicker = document.getElementById('light-color');
    lightColorPicker.value = '#ffffff';
    lightColor = 0xffffff;
    
    lightColorPicker.addEventListener('input', (e) => {
        const hexColor = e.target.value;
        lightColor = parseInt(hexColor.replace('#', '0x'), 16);
        
        // Actualizar color de la luz principal
        if (mainLight) {
            mainLight.color.setHex(lightColor);
        }
        
        console.log(`Color de iluminación cambiado a: ${hexColor}`);
    });
    
    // 3. Control de velocidad global (órbita) - CON TRANSICIÓN SUAVE
    const globalSlider = document.getElementById('global-speed');
    const globalValue = document.getElementById('global-speed-value');
    
    globalSlider.addEventListener('input', (e) => {
        targetGlobalSpeed = parseFloat(e.target.value);
        globalValue.textContent = targetGlobalSpeed.toFixed(1);
        console.log(`Velocidad orbital objetivo: ${targetGlobalSpeed}`);
    });
    
    // 4. Control de velocidad de eje (rotación propia)
    const axisSlider = document.getElementById('axis-speed');
    const axisValue = document.getElementById('axis-speed-value');
    
    axisSlider.addEventListener('input', (e) => {
        axisSpeed = parseFloat(e.target.value);
        axisValue.textContent = axisSpeed.toFixed(1);
        console.log(`Velocidad de rotación: ${axisSpeed}`);
    });
    
    // 5. Botón de reinicio
    const resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', () => {
        // Restablecer valores
        targetGlobalSpeed = 0.5;
        axisSpeed = 1.0;
        cubeColor = 0x3498db;
        lightColor = 0xffffff;
        
        // Actualizar controles UI
        globalSlider.value = targetGlobalSpeed;
        globalValue.textContent = targetGlobalSpeed.toFixed(1);
        
        axisSlider.value = axisSpeed;
        axisValue.textContent = axisSpeed.toFixed(1);
        
        colorPicker.value = '#3498db';
        lightColorPicker.value = '#ffffff';
        
        // Actualizar propiedades de los cubos
        cubes.forEach((cube, index) => {
            // Restaurar color
            cube.material.color.setHex(cubeColor);
            
            // Posicionar en línea horizontal inicial
            const initialPositions = [-5, 0, 5, -7, 7, 0];
            const yOffsets = [0, 1, 0, -1, 1.5, -2];
            cube.position.set(initialPositions[index], yOffsets[index], 0);
            cube.rotation.set(0, 0, 0);
            
            // Restaurar ángulo inicial
            cube.userData.currentAngle = (index - 3) * (Math.PI / 4);
            cube.userData.orbitSpeed = 0.5;
        });
        
        // Restaurar color de iluminación
        if (mainLight) {
            mainLight.color.setHex(lightColor);
        }
        
        // Centrar la cámara si hay controles
        if (controls) {
            controls.reset();
            camera.position.set(0, 3, 15);
            controls.target.set(0, 0, 0);
        }
        
        console.log("Todos los valores reiniciados");
    });
    
    console.log("Interfaz configurada con control de iluminación");
}

// MANEJAR CAMBIO DE TAMAÑO DE VENTANA
function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    console.log(`Ventana redimensionada: ${window.innerWidth}x${window.innerHeight}`);
}

// BUCLE DE ANIMACIÓN - CON TRANSICIÓN SUAVE
function animate() {
    requestAnimationFrame(animate);
    
    // Actualizar controles de cámara
    if (controls) controls.update();
    
    // SUAVIZAR TRANSICIÓN DE VELOCIDAD
    const speedDiff = targetGlobalSpeed - currentGlobalSpeed;
    currentGlobalSpeed += speedDiff * SPEED_TRANSITION_SPEED;
    
    // Animar cubos (rotación orbital + rotación propia)
    cubes.forEach((cube) => {
        // Actualizar ángulo de órbita de forma CONTINUA y SUAVE
        cube.userData.currentAngle += 0.01 * currentGlobalSpeed * cube.userData.orbitSpeed;
        
        // Posición en órbita circular usando el ángulo actual
        const orbitRadius = cube.userData.orbitRadius;
        const orbitAngle = cube.userData.currentAngle + cube.userData.angleOffset;
        
        cube.position.x = Math.cos(orbitAngle) * orbitRadius;
        cube.position.z = Math.sin(orbitAngle) * orbitRadius;
        cube.position.y = cube.userData.yOffset;
        
        // Rotación sobre su propio eje con velocidad personalizada
        const rotationSpeed = axisSpeed * cube.userData.rotationMultiplier;
        cube.rotation.x += 0.01 * rotationSpeed;
        cube.rotation.y += 0.012 * rotationSpeed;
        cube.rotation.z += 0.008 * rotationSpeed;
    });
    
    // Renderizar escena
    renderer.render(scene, camera);
}

// INICIAR CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que Three.js esté cargado
    if (typeof THREE === 'undefined') {
        const errorHTML = `
            <div style="
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: #000000;
                color: #ffffff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 20px;
                z-index: 10000;
                font-family: 'Segoe UI', sans-serif;
            ">
                <h1 style="color: #ff4444; margin-bottom: 20px;">ERROR DE CARGA</h1>
                <p style="margin-bottom: 20px;">Three.js no se pudo cargar correctamente.</p>
                <button onclick="location.reload()" style="
                    background: #222222;
                    color: #ffffff;
                    border: 1px solid #333333;
                    padding: 12px 24px;
                    font-size: 14px;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">
                    RECARGAR PÁGINA
                </button>
            </div>
        `;
        document.body.innerHTML = errorHTML;
        return;
    }
    
    // Pequeña pausa para asegurar que todo esté listo
    setTimeout(init, 100);
});

// MANEJAR ERRORES
window.addEventListener('error', (e) => {
    console.error('Error capturado:', e.error);
});