import Link from 'next/link'

  <div className="flex items-center gap-2">
    {navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
          pathname === item.href
            ? "bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            : "text-muted-foreground hover:text-primary hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10 hover:scale-105"
        }`}
      >
        <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          {item.icon}
        </span>
        <span className="relative z-10">{item.label}</span>
        <div className={`absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          pathname === item.href ? "from-primary/20 via-primary/30 to-primary/20" : ""
        }`} />
      </Link>
    ))}
  </div> 