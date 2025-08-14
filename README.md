# Arquitectura DDD

```
src/
├── app.module.ts
├── config/
│   ├── env.config.ts
├── shared/
│   ├── constants/
│   │   └── tokens.ts
│   └── utils/
│       └── result.ts
└── modules/
    └── auth/
        ├── auth.module.ts
        ├── domain/                         # Reglas de negocio puras
        │   ├── entities/
        │   │   └── user.entity.ts
        │   ├── value-objects/
        │   │   └── email.vo.ts
        │   ├── services/
        │   │   └── user-domain.service.ts  # (si aplica lógica de negocio cross-entity)
        │   ├── events/
        │   │   ├── domain-event.ts
        │   │   └── user-registered.event.ts
        │   └── errors/
        │       ├── domain-error.ts
        │       └── invalid-credentials.error.ts
        ├── application/                    # Orquestación de casos de uso
        │   ├── dto/
        │   │   ├── login.dto.ts
        │   │   └── register-user.dto.ts
        │   ├── ports/
        │   │   ├── user-repository.port.ts
        │   │   ├── password-hasher.port.ts
        │   │   └── event-bus.port.ts              # <- publicación de eventos (Kafka/NATS/etc.)
        │   ├── use-cases/
        │   │   ├── login.use-case.ts
        │   │   └── register-user.use-case.ts
        │   └── mappings/
        │       └── integration-events.mapper.ts   # <- mapea DomainEvent -> IntegrationEvent
        ├── infrastructure/                 # Adaptadores concretos
        │   ├── hashing/
        │   │   └── bcrypt-password-hasher.ts
        │   ├── persistence/
        │   │   ├── in-memory/
        │   │   │   └── user.in-memory-repository.ts
        │   │   └── typeorm/                # (opcional DB real)
        │   │       ├── user.orm-entity.ts
        │   │       └── user.typeorm-repository.ts
        │   └── messaging/
        │       └── kafka/
        │           ├── kafka-event-bus.ts         # <- productor Kafka (implementa EventBusPort)
        │           └── kafka-consumer.controller.ts# <- consumer Kafka (handlers @MessagePattern)
        └── interface/                      # Delivery (HTTP/gRPC/NATS…)
            └── http/
                └── auth.controller.ts

```

# 🗂️ Descripción de cada carpeta y responsabilidades

## 📂 domain/ — El corazón del negocio

Aquí vive lo que tu sistema hace sin importar en qué tecnología esté escrito ni cómo se conecta con el mundo exterior.
Si mañana decides reescribir tu app en otro framework, esto debería seguir igual.

1. entities/ → Son los objetos principales del negocio, con identidad y reglas propias.
Ej: User, Order, Product.
Un User sabe que debe tener un email válido y una fecha de creación.

2. value-objects/ → Son “tipos especiales” que tienen valor e invariantes, pero no identidad propia.
Ej: Email (se asegura que el formato sea correcto), Money (que siempre tenga moneda y valor positivo).
Se usan dentro de entidades.

3. services/ → Lógica de negocio que no pertenece solo a una entidad y que normalmente necesita varias para funcionar.
Ej: un servicio de dominio que calcule un descuento combinando usuario + producto.

4. events/ → Hechos importantes que ocurren en el negocio y que queremos que el sistema “cuente” hacia afuera.
Ej: UserRegisteredDomainEvent cuando un usuario se registra.
Esto no es un mensaje Kafka todavía, es un evento puro de negocio.

5. errors/ → Errores que pueden ocurrir en el negocio, definidos aquí para que no dependan de HTTP ni base de datos.
Ej: InvalidCredentialsError.

## 📂 application/ — El orquestador

Esta capa sabe qué hay que hacer para cumplir una acción del negocio, pero no sabe cómo lo hace cada detalle técnico.
Es como el director de una obra: da las órdenes, pero no construye el escenario ni actúa.

1. dto/ → Datos que necesita un caso de uso para funcionar o que devuelve como resultado.
Ej: RegisterUserDto con email y password.
Son simples estructuras de datos, no reglas de negocio.

2. ports/ → Interfaces que dicen qué servicios necesita la aplicación para trabajar, sin importar la implementación.
Ej: UserRepositoryPort dice que necesitamos guardar y buscar usuarios, pero no dice cómo (eso lo hará infraestructura).
Ej: EventBusPort para publicar eventos a Kafka, pero sin saber cómo se conecta.

3. use-cases/ → Los casos de uso reales: “Registrar usuario”, “Iniciar sesión”, “Hacer compra”.
Aquí se llama a entidades, se validan reglas y se usan los puertos para interactuar con el exterior.

4. mappings/ → Traductores que convierten Domain Events en Integration Events listos para enviarse por Kafka u otro medio.
Ej: de UserRegisteredDomainEvent a { topic: 'user.registered', payload: {...} }.

## 📂 infrastructure/ — Los conectores con el mundo real

Aquí viven las implementaciones concretas que usan tecnologías específicas.
Si mañana cambias de base de datos o de mensajería, solo tocas esta capa.

1. hashing/ → Implementaciones concretas para encriptar/verificar contraseñas.
Ej: BcryptPasswordHasher que usa la librería bcrypt.

2. persistence/ → Implementaciones reales del UserRepositoryPort.
Ej: UserInMemoryRepository (guarda en memoria) o UserTypeormRepository (usa TypeORM + Postgres).

3. messaging/kafka/ →

4. kafka-event-bus.ts: Implementación de EventBusPort para publicar mensajes a Kafka.

5. kafka-consumer.controller.ts: Escucha mensajes de Kafka y llama a casos de uso internos.

## 📂 interface/ — La puerta de entrada

Aquí están los controladores o manejadores de protocolo.
Reciben peticiones HTTP, gRPC, NATS, Kafka… y las traducen a casos de uso.

1. http/ → Controladores REST de NestJS.
Ej: AuthController recibe POST /register, valida el cuerpo y llama a RegisterUserUseCase.

## 📂 shared/ — Utilidades comunes

Aquí guardamos cosas reutilizables en cualquier módulo.

1. tokens.ts → Constantes para inyección de dependencias usando interfaces (Symbol('USER_REPOSITORY')).
Así evitamos acoplar código a clases concretas.

2. result.ts → Una forma tipada y controlada de devolver éxito o error sin tener que lanzar excepciones por todo.

## 💡 Idea clave:

1. domain → Qué es el negocio.
2. application → Qué hay que hacer y en qué orden.
3. infrastructure → Cómo se conecta con el mundo real.
4. interface → Cómo se expone al exterior.
5. shared → Herramientas y utilidades comunes.