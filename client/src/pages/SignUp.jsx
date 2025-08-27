import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { api } from '../api/axios';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

function SignupPage() {

  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const url ='/auth/register';
    await api.post(url, form);
    nav('/dashboard');
  };

  return (
    <div className="min-h-screen  bg-white flex items-center justify-center p-4 font-chewy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl  bg-white  rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">Memoire</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign up to get started
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}  className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
            
                  onChange={e=>setForm({...form, name:e.target.value})}
                  required
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-0 rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
        
                  onChange={e=>setForm({...form, email:e.target.value})}
                  required
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-0 rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
  
                  onChange={e=>setForm({...form, password:e.target.value})}
                  required
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-0 rounded-full"
                />
              </div>

          

              <Button
                type="submit"
                className="w-full font-medium rounded-full font-chewy bg-black text-white hover:bg-gray-800 transition-colors"
         
              >
         Sign up
              </Button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <span className="h-px w-full"></span>
                <span className="absolute bg-white  px-2 text-sm text-gray-500 ">
                  OR
                </span>
              </div>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
               to="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default SignupPage;