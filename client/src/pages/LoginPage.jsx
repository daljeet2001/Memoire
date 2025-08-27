import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from '../api/axios';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";


export default function Login() {

  const nav = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });


  const submit = async (e) => {
    e.preventDefault();
    const url ='/auth/login';
    await api.post(url, form);
    nav('/dashboard');
  };

  return (
    <>



  <div className="min-h-screen   flex items-center justify-center  p-4 " >


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl bg-white rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-chewy  font-bold">Memoire</CardTitle>
            <p className="text-sm text-gray-500 font-chewy dark:text-gray-400">
              Sign in to your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}  className="space-y-6">
              <div className="space-y-2 font-chewy">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                 onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className=" border-gray-300 dark:border-gray-700 focus-visible:ring-0 rounded-full"
                />
              </div>

              <div className="space-y-2 font-chewy">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-0 rounded-full"
                />
              </div>

         

              <Button
                type="submit"
                className="w-full font-medium rounded-full font-chewy bg-black text-white hover:bg-gray-800 transition-colors"
           
              >
            Sign in
              </Button>

              {/* Divider */}
              <div className="relative flex items-center justify-center font-chewy">
                <span className="h-px w-full bg-gray-200 dark:bg-gray-700"></span>
                <span className="absolute bg-white  px-2 text-sm text-gray-500 ">
                  OR
                </span>
              </div>
            </form>

             {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 font-chewy">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>


          </CardContent>
        </Card>
      </motion.div>
    </div>

    </>
  );
}