# Auth Feature

## Scope
Handles authentication, authorization, and role management.

## Entities
- `Role` — maps to `roles` table (id, name)
- `User` — (coming later)
- `RefreshToken` — (coming later)

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/admin/roles | List all roles |
| GET | /api/v1/admin/roles/:id | Get role by ID |
| POST | /api/v1/admin/roles | Create role |
| PATCH | /api/v1/admin/roles/:id | Update role |
| DELETE | /api/v1/admin/roles/:id | Delete role |

## Notes
- Role names must be unique
- Default roles: `admin`, `customer`
