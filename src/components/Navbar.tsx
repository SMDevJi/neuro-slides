import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="flex justify-around items-center border border-b-gray-300 h-20">
            <div className="logo w-15 h-15 rounded-full">
                <img src="/logo.png" alt="Logo" />
            </div>
            <div className="routes flex gap-4">
                <Link href='/workspace'>Workspace</Link>
                <Link href='/pricing'>Pricing</Link>
            </div>
            <div className="account">
                <button >Get started</button>
            </div>
        </nav>
    )
}

export default Navbar