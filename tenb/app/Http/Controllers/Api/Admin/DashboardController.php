<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Category;
use App\Models\Post;
use App\Models\PostView;
use App\Models\Ticket;
use App\Models\Publik;
use App\Models\ProofOfWork;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
            // count users
                $users = User::count();

            // count proof_of_works
                $proof_of_works = ProofOfWork::count();

            // count tickets Pegawai BNPT & Publik
                $ticketsPegawai = Ticket::count();
                $ticketsPublik  = Publik::count();

            // Hitung tiket pegawai yang belum ditugaskan (baru dibuat)
                $ticketsMenunggu = Ticket::whereNull('assigned_to')->count();

            // Hitung tiket publik yang belum ditugaskan (baru dibuat)
                $publiksMenunggu = Publik::whereNull('assigned_to')->count();

            // Gabungkan hasil
                $totalMenunggu = $ticketsMenunggu + $publiksMenunggu;

            // count tickets in 'proses' status
                $ticketsProses = Ticket::where('status', 'proses')->count();
                $publiksProses = Publik::where('status', 'proses')->count();
                $totalProses   = $ticketsProses + $publiksProses;

            // count tickets pegawai & publik in 'selesai' status
                $ticketsSelesai = Ticket::where('status', 'selesai')->count();
                $publiksSelesai = Publik::where('status', 'selesai')->count();
                $totalSelesai   = $ticketsSelesai + $publiksSelesai;

            // count tickets pegawai & publik in 'close' status
                $ticketsClose   = Ticket::where('status', 'close')->count();
                $publiksClose   = Publik::where('status', 'close')->count();
                $totalClose     = $ticketsClose + $publiksClose;

            // count tickets by jenis tiket (kendala & permohonan)
                $ticketsKendala = Ticket::where('jenis_tiket', 'kendala')->count();
                $publiksKendala = Publik::where('jenis_tiket', 'kendala')->count();
                $totalKendala   = $ticketsKendala + $publiksKendala;

                $ticketsPermohonan = Ticket::where('jenis_tiket', 'permohonan')->count();
                $publiksPermohonan = Publik::where('jenis_tiket', 'permohonan')->count();
                $totalPermohonan   = $ticketsPermohonan + $publiksPermohonan;

            // total tiket
                $totalTiketKeseluruhan = $ticketsPegawai + $ticketsPublik;

            // count categories
                $categories = Category::count();

            // count posts
                $posts = Post::count();

                $post_views = PostView::select([
                    DB::raw('count(id) as count'),
                    DB::raw('DATE(created_at) as day')
                ])
                ->groupBy('day')
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->get();

                if(count($post_views))
                {
                    foreach ($post_views as $result)
                    {
                        $count[] = (int) $result->count;
                        $day[] = $result->day;
                    }
                } else{
                    $count[] = "";
                    $day[] = "";
                }

        return response()->json([
            'success'                               => true,
            'message'                               => 'List Data on Dashboard',
            'data'                                  => [
                'users'                             => $users,
                'bukti_pengerjaan'                  => $proof_of_works,
                'ticket_pegawai'                    => $ticketsPegawai,
                'ticket_publik'                     => $ticketsPublik,
                'ticket_menunggu_pengerjaan'        => $totalMenunggu,
                'ticket_proses'                     => $totalProses,
                'ticket_selesai'                    => $totalSelesai,
                'ticket_close'                      => $totalClose,
                'jumlah_kendala'                    => $totalKendala,
                'jumlah_permohonan'                 => $totalPermohonan,
                'total_ticket'                      => $totalTiketKeseluruhan,
                'categories'                        => $categories,
                'posts'                             => $posts,
                'posts_views'                       => [
                    'count'                         => $count,
                    'day'                           => $day
                                                       ],
            ]
        ]);
    }

    // public function trackWork()
    // {
    //     // Ambil semua tiket pegawai yang sudah ditugaskan
    //     $pegawaiTickets = Ticket::whereNotNull('assigned_to')
    //         ->with('assignedStaff')
    //         ->get();

    //     // Ambil semua tiket publik yang sudah ditugaskan
    //     $publikTickets = Publik::whereNotNull('assigned_to')
    //         ->with('assignedStaff')
    //         ->get();

    //     // Gabungkan kedua koleksi tiket pegawai dan publik
    //     $allTickets = $pegawaiTickets->concat($publikTickets);

    //     return response()->json([
    //         'success' => true,
    //         'tickets' => $allTickets,
    //     ]);
    // }
}
