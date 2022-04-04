@extends('_layouts.noads')

@section('title')
<title>Photos from previous years!</title>
@endsection

@section('body')
<!-- Full Page Image Header with Vertically Centered Content -->
<header class="h-100">
  <div class="container h-100">
    <h1>Photo reminders from previous years</h1>
    <div class="row">
        <?php
            $h = scandir(getcwd()."/source/assets/images/workadventure/photos");
            foreach($h as $p){ 
                if($p == "." || $p == ".."){
                    continue;
                }
?>
                <div class="col-xl-2 col-sm-3 col-xs-6">
                    <a href="/assets/images/workadventure/photos/<?php echo $p; ?>" class="fancybox" rel="ligthbox">
                        <div class="card mb-3">
                           <img src="/assets/images/workadventure/photos/<?php echo $p; ?>" class="zoom w-100 img-fluid "  alt="">
                        </div>
                    </a>
                </div>
           <?php } ?>
    </div>

  <script>
    $(document).ready(function(){
        $(".fancybox").fancybox({
                nextEffect: "fade",
                prevEffect: "fade",
                padding: 2,
                titlePosition: "outside"
            });
    });
  </script>
</header>
@endsection
