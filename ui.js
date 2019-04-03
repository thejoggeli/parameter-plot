function Ui(){}
Ui.init = function(){
	$("input[type=text]").on("change keyup", function(){
		$(this).addClass("unsaved");
		$(".plot-it").addClass("unsaved");
	});
	$(".plot-it").on("click", function(){
		Ui.beginPlot();
	});
	$("#ui-1 input[type=text]").on("keyup", function(e){
		if(e.keyCode == 13){
			Ui.beginPlot();
		}
	});
	$("input[type=text]").on("focus", function(){
		$(this).addClass("has-focus");
	});
	$("input[type=text]").on("blur", function(){
		$(this).removeClass("has-focus");
	});
	$("#ui-1 .minimize").on("click", function(){
		$("#ui-1 .maximize").show();
		$("#ui-1 .minimize").hide();
		$("#ui-1 .category").hide();
	});
	$("#ui-1 .maximize").on("click", function(){
		$("#ui-1 .maximize").hide();
		$("#ui-1 .minimize").show();
		$("#ui-1 .category").show();		
	});
	$(".grid-xz").on("click", function(){
		$(this).toggleClass("active");
		Grid.grids.xz.visible = $(this).hasClass("active");
		Ui.toCookie();
	});
	$(".grid-xy").on("click", function(){
		$(this).toggleClass("active");
		Grid.grids.xy.visible = $(this).hasClass("active");
		Ui.toCookie();
	});
	$(".grid-yz").on("click", function(){
		$(this).toggleClass("active");
		Grid.grids.yz.visible = $(this).hasClass("active");
		Ui.toCookie();
	});
	$(".animation-state").on("click", function(){
		$(this).toggleClass("active");
		Plotter.setAnimationState($(this).hasClass("active"));
		$(".animation-state").html(Plotter.getTimeButtonString());
		Ui.toCookie();
	});
	$(".volume-mode-axis").on("click", function(){
		$(this).toggleClass("active");
		var active = $(this).hasClass("active");
		$(".volume-mode").removeClass("active");
		Plotter.volumeMode = "none";
		if(active){
			$(this).addClass("active");
			Plotter.volumeMode = "axis";
		}
		Ui.applyValues();
		Plotter.plot();
	});
	$(".volume-mode-line").on("click", function(){
		$(this).toggleClass("active");
		var active = $(this).hasClass("active");
		$(".volume-mode").removeClass("active");
		Plotter.volumeMode = "none";
		if(active){
			$(this).addClass("active");
			Plotter.volumeMode = "line";
		}
		Ui.applyValues();
		Plotter.plot();
	});
	$(".volume-mesh").on("click", function(){
		$(this).toggleClass("active");
		Ui.applyValues();
		Plotter.plot();		
	});
	$(".volume-wireframe").on("click", function(){
		$(this).toggleClass("active");
		Ui.applyValues();
		Plotter.plot();			
	});
	$(".volume-radius").on("keyup", function(e){
		if(e.keyCode == 13 && !$(".volume-mode-line").hasClass("active")){
			$(".volume-mode-line").trigger("click");
		}
	});
	$(".volume-axis").on("keyup", function(e){
		if(e.keyCode == 13 && !$(".volume-mode-axis").hasClass("active")){
			$(".volume-mode-axis").trigger("click");
		}
	});
	Ui.fromCookie();
}

Ui.updateValues = function(){
	$(".input.x-scale").val(Grid.scale.x);
	$(".input.y-scale").val(Grid.scale.y);
	$(".input.z-scale").val(Grid.scale.z);
	if(Grid.grids.xz.visible) $(".grid.xz").addClass("active");
	else $(".grid.xz").removeClass("active");
	if(Grid.grids.yz.visible) $(".grid.yz").addClass("active");
	else $(".grid.yz").removeClass("active");
	if(Grid.grids.xy.visible) $(".grid.xy").addClass("active");
	else $(".grid.xy").removeClass("active");
	$(".animation-state").html(Plotter.getTimeButtonString());
	$(".volume-mode").removeClass("active");
	if(Plotter.volumeMode == "axis") $(".volume-mode-axis").addClass("active");
	if(Plotter.volumeMode == "line") $(".volume-mode-line").addClass("active");
}

Ui.applyValues = function(){
	try {
		var mint = math.eval($(".min-t").val());
		Plotter.bounds.min = mint;
	} catch(e) {
		alert("invalid: t minimum");
		console.error(e);
		return false;
	}	
	try {
		var maxt = math.eval($(".max-t").val());
		Plotter.bounds.max = maxt;
	} catch(e) {
		alert("invalid: t maximum");
		console.error(e);
		return false;
	}	
	try {
		var stept = math.eval($(".step-t").val());
		Plotter.step = stept;
	} catch(e) {
		alert("invalid: t step");
		console.error(e);
		return false;
	}	
	Grid.scale.x = parseFloat($("input.x-scale").val());
	Grid.scale.y = parseFloat($("input.y-scale").val());
	Grid.scale.z = parseFloat($("input.z-scale").val());
	Grid.grids.xy.visible = $(".grid-xy").hasClass("active");
	Grid.grids.xz.visible = $(".grid-xz").hasClass("active");
	Grid.grids.yz.visible = $(".grid-yz").hasClass("active");
	Plotter.volumeMode = "none";
	if($(".volume-mode-axis").hasClass("active")) Plotter.volumeMode = "axis";
	if($(".volume-mode-line").hasClass("active")) Plotter.volumeMode = "line";
	Plotter.volumeStep = parseFloat($(".volume-step").val());
	Plotter.volumeAngles = parseFloat($(".volume-angles").val());
	Ui.updateValues();
	Plotter.setAnimationState($(".animation-state").hasClass("active"));
	Plotter.volumeRadius = parseFloat($(".volume-radius").val());
	var split = $(".volume-axis").val().split(",");
	if(split.length < 3){
		alert("invalid axis format: " + $(".volume-axis").val() + "\ntry: x,y,z");
	} else {
		Plotter.volumeAxis.x = parseFloat(split[0]);
		Plotter.volumeAxis.y = parseFloat(split[1]);
		Plotter.volumeAxis.z = parseFloat(split[2]);
	}
	Plotter.volumeShowMesh = $(".volume-mesh").hasClass("active");
	Plotter.volumeShowWireframe = $(".volume-wireframe").hasClass("active");
	Ui.toCookie();
	return true;
}

Ui.beginPlot = function(){
	if(Ui.applyValues()){		
		var expression = $(".expression-input").val()
		Grid.build();	
		expression = {
			x: $(".x-plot").val(),
			y: $(".y-plot").val(),
			z: $(".z-plot").val(),
		};
		$(".unsaved").removeClass("unsaved");
		if(!Plotter.plot(expression)){
			alert("Plot failed");
		}
	}
}

Ui.toggles = [
	"grid-xz",
	"grid-yz",
	"grid-xy",
	"volume-mode-axis",
	"volume-mode-line",
	"volume-mesh",
	"volume-wireframe",
//	"animation-state",
];
Ui.fromCookie = function(){
	$("#ui-1 input[type=text], #ui-1 input[type=range]").each(function(){
		var name = "ui-" + $(this).attr("name");
		var val = Storage.window.get(name, null);
		if(val !== null){
			$(this).val(val);
		}
	});
	for(var t in Ui.toggles){
		var name = "ui-" + Ui.toggles[t];
		var val = Storage.window.get(name, null);
		if(val !== null){
			if(val){
				$("."+Ui.toggles[t]).addClass("active");
			} else {
				$("."+Ui.toggles[t]).removeClass("active");
			}
		}
	}
}
Ui.toCookie = function(){
	$("#ui-1 input[type=text], #ui-1 input[type=range]").each(function(){
		var name = "ui-" + $(this).attr("name");
		var val = $(this).val();
		Storage.window.set(name, $(this).val());
	});
	for(var t in Ui.toggles){
		var name = "ui-" + Ui.toggles[t];
		var val = $("."+Ui.toggles[t]).hasClass("active");
		Storage.window.set(name, val);
	}
}

