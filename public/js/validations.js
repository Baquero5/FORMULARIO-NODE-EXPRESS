// Debounce helper
function debounce(fn, delay=350){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), delay); };
}

// reglas simples JS
function validateDni(el){
  const val = el.value.trim();
  const re = /^\d{7,10}$/;
  applyState(el, re.test(val), 'DNI debe tener 7-10 dígitos');
}

function validateName(el){
  const val = el.value.trim();
  const re = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
  applyState(el, re.test(val), 'Requiere sólo letras y al menos 2 caracteres');
}

function validateDate(el){
  if (!el.value) return applyState(el, false, 'Fecha requerida');
  const fecha = new Date(el.value);
  if (fecha >= new Date()) return applyState(el, false, 'Fecha debe ser anterior a hoy');
  applyState(el, true, '');
}

function applyState(el, ok, msg){
  el.classList.remove('is-valid','is-invalid');
  if (ok) el.classList.add('is-valid');
  else el.classList.add('is-invalid');
  // mostrar mensaje si existe div.invalid-feedback (si no, lo podemos crear)
  let f = el.nextElementSibling;
  if (f && f.classList && f.classList.contains('invalid-feedback')) {
    f.textContent = msg;
  }
}

// conectar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const dni = document.getElementById('dni');
  const nombres = document.getElementById('nombres');
  const apellidos = document.getElementById('apellidos');
  const fecha = document.getElementById('fechaNacimiento');

  if (dni) dni.addEventListener('input', debounce(()=>validateDni(dni)));
  if (nombres) nombres.addEventListener('input', debounce(()=>validateName(nombres)));
  if (apellidos) apellidos.addEventListener('input', debounce(()=>validateName(apellidos)));
  if (fecha) fecha.addEventListener('change', () => validateDate(fecha));
});
