<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class GameController extends Controller
{
    public function index()
    {
        return view('app', [
            'component' => 'Home',
            'props' => [
                'title' => 'Home',
                'isAuthenticated' => Auth::check(),
                'userName' => Auth::check() ? Auth::user()->name : null,
                'userAvatar' => Auth::check() && Auth::user()->profile_picture ? Storage::url(Auth::user()->profile_picture) : null,
            ],
        ]);
    }

    public function play(string $mode = 'game')
    {
        return view('app', [
            'component' => 'GamePlay',
            'props' => [
                'title' => ucfirst($mode) . ' Mode',
                'mode' => $mode,
                'isAuthenticated' => Auth::check(),
                'userName' => Auth::check() ? Auth::user()->name : null,
                'userAvatar' => Auth::check() && Auth::user()->profile_picture ? Storage::url(Auth::user()->profile_picture) : null,
            ],
        ]);
    }

    public function gallery()
    {
        if (!Auth::check()) {
            return redirect()->route('home');
        }

        $games = Auth::user()->games()->orderBy('created_at', 'desc')->get();
        
        return view('app', [
            'component' => 'Replays',
            'props' => [
                'title' => 'Match Replays',
                'games' => $games,
            ],
        ]);
    }

    public function replay(Game $game)
    {
        if (!Auth::check() || $game->user_id !== Auth::id()) {
            return redirect()->route('home');
        }

        return view('app', [
            'component' => 'Replay',
            'props' => [
                'title' => 'Replaying Match #' . $game->id,
                'game' => $game,
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Guest game not saved'], 200);
        }

        $validated = $request->validate([
            'winner' => 'required|string',
            'mode' => 'required|string',
            'moves' => 'required|array',
            'initial_dimensions' => 'required|array',
        ]);

        $game = Auth::user()->games()->create($validated);

        return response()->json($game, 201);
    }

    public function destroy(Game $game)
    {
        if (!Auth::check() || $game->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $game->delete();

        return response()->json(['message' => 'Match deleted successfully']);
    }
}
