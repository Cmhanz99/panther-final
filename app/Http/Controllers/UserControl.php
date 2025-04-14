<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserControl extends Controller
{
    public function signin(Request $request){
        $user = [
            'name' => 'Hanz',
            'password' => '123456'
        ];

        $request->validate([
            'name' => 'required',
            'password' => 'required'
        ]);

        if($request->name == $user['name'] && $request->password == $user['password']){
            return redirect('/');  // Removed the with() message
        } else {
            return back()->withErrors(['error' => 'Invalid credentials']);
        }
    }

    public function sign_in(){
        return view('signup');
    }

    public function pagest(){
        return view('page');
    }
}
