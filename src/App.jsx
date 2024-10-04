import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { z } from "zod";

const schema = z.object({
  nombre: z.string(),
  email: z.string().email()
})

function App() {

  const { register, handleSubmit, formState: {
     errors,
     isSubmitting,
  }, watch, setValue, reset, setError } = useForm({
    defaultValues: {
      nombre: "Marcelo",
      email: "malacalzamarcelo@gmail.com",
      // pais: "ar",
      // provincia: "Buenos Aires"
    },
    resolver: zodResolver(schema)
  })

  console.log(errors);
  

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      throw new Error()
      console.log(data);
      alert("Enviando formulario...")
      reset()
      
    } catch (error) {
      setError("root", {
        message: "El email ya está utilizado"
      })
    }
  })

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="nombre">Nombre</label>
        <input type="text" id="nombre" {...register("nombre", {
          required: {
            value: true,
            message: "El nombre es requerido"
          },
          minLength: {
            value: 2,
            message: "El nombre debe tener al menos 2 caracteres"
          },
          maxLength: {
            value: 20,
            message: "El nombre debe tener menos de 20 caracteres"
          }
        })}/>
        {errors.nombre && <span>{errors.nombre.message}</span>}
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register("email", {
          required: {
            value: true,
            message: "El email es requerido"
          },
          pattern: {
            value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
            message: "El email no es válido"
          }
        })}/>
        {errors.email && <span>{errors.email.message}</span>}

        <label htmlFor="contraseña">Contraseña</label>
        <input type="password" id="contraseña" {...register("contraseña", {
          required: {
            value: true,
            message: "La contraseña es requerida"
          },
          minLength: {
            value: 6,
            message: "La contaseña debe tener al menos 6 caracteres"
          },
        })}/>
        {errors.contraseña && <span>{errors.contraseña.message}</span>}

        <label htmlFor="confirmarContraseña">Confirmar contraseña</label>
        <input type="password" id="confirmarContraseña" {...register("confirmarContraseña", {
          required: {
            value: true,
            message: "La confirmación de contraseña es requerida"
          },
          validate: (value) =>  value === watch("contraseña") || "Las contraseñas no coinciden"
        })}/>
        {errors.confirmarContraseña && <span>{errors.confirmarContraseña.message}</span>}

        <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
        <input type="date" id="fechaNacimiento" {...register("fechaNacimiento", {
          required: {
            value: true,
            message: "La fecha de nacimiento es requerida"
          },
          validate: (value) => {
            const fechaNacimento = new Date(value)
            const fechaActual = new Date()
            const edad = fechaActual.getFullYear() - fechaNacimento.getFullYear()
            return edad >= 18 || "Debe ser mayor de edad"
          }
        })}/>
        {errors.fechaNacimiento && <span>{errors.fechaNacimiento.message}</span>}

        <label htmlFor="pais">País</label>
        <select name="pais" id="pais" {...register("pais")} defaultValue="default">
          <option value="default" disabled>Seleccione país</option>
          <option value="mx">México</option>
          <option value="co">Colombia</option>
          <option value="ar">Argentina</option>
        </select>
        {watch("pais") === 'ar' && (
          <>
          <input type="text" placeholder="Provincia" {...register('provincia', {
            required: {
              value: true,
              message: "La provincia es requerida"
            }
          })} />
          {errors.provincia && <span>{errors.provincia.message}</span>}
          </>
        )}
        <label htmlFor="archivo">Foto de perfil</label>
        <input type="file" id="archivo" onChange={(e) => {
          console.log(e.target.files[0]);
          setValue('fotoDePerfil', e.target.files[0].name)
        }} />
        <label htmlFor="terminos">Acepto los términos y condiciones</label>
        <input type="checkbox" id="terminos" {...register("terminos", {
          required: {
            value: true,
            message: "Debes aceptar los términos y condiciones"
          }
        })}/>
        {errors.terminos && <span>{errors.terminos.message}</span>}

        <button disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar"}</button>
        {errors.root && <span>{errors.root.message}</span>}

        <pre>
        {JSON.stringify(watch(), null, 2)}
        </pre>
      </form>
    </>
  )
}

export default App
