export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Recursos gráficos']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Premios',
        to: '/premios',
        icon: 'cil-star'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Imágenes',
        to: '/imagenes',
        icon: 'cil-cursor'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Canjes',
        to: '/canjes',
        icon: 'cil-puzzle'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Recursos internos']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Actualizaciones',
        to: '/actualizaciones',
        icon: 'cil-list'
      },

      {
        _name: 'CSidebarNavItem',
        name: 'Usuarios',
        to: '/users',
        icon: 'cil-people'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Jugadores',
        to: '/jugadores',
        icon: 'cil-user'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Departamentos',
        to: '/departamentos',
        icon: 'cil-location-pin'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Municipios',
        to: '/municipios',
        icon: 'cil-location-pin'
      },
    ]
  }
]