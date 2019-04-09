
function get_input(){
	var input_html = document.querySelector("#HTML_textarea").value;
	var input_css = document.querySelector("#CSS_textarea").value;

	var str = scoping_CSS_str(input_css,"rendered_html")+input_html;
	return str;
}

function scoping_CSS_str(input_css,scope_class){
	var str = "."+scope_class + " " + input_css.replace(/}/g,"} ."+ scope_class + " ");
	str = `
		<style>
			${str}
		</style>
	`;
	str = str.replace("body","");
	return str
}

function render_html(){
	document.querySelector(".rendered_html").innerHTML = get_input();
}

function initialize(){

	if (store.get('saved_obj')==undefined) {
		// var code_obj = "";
		// {
		// 	html_str:"",
		// 	css_str:"",
		// 	edit_attr_str:""
		// };
		store.set('saved_obj',[]);
	}
	import_load();
	activate_element();
}

initialize();

function save_above_code(){
	let str1 = document.querySelector("#HTML_textarea").value;
	let str2 = document.querySelector("#CSS_textarea").value;

	let obj = {
		html_str : str1,
		css_str : str2,
		edit_info : ""
	};

	let saved_obj = store.get('saved_obj');
	saved_obj.unshift(obj);
	store.set('saved_obj',saved_obj);
}

function overwrite_code(){

}








function make_load_box(obj, int){
	var new_node = document.createElement("div");
	new_node.setAttribute("class","template");
	
	var display_node = document.createElement("div");
	display_node.setAttribute("class","preview"+" style"+int.toString());
	display_node.innerHTML = scoping_CSS_str(obj.css_str,"style"+int.toString())+obj.html_str;

	var btn_node = document.createElement("div");
	btn_node.setAttribute("class","delete_btn");
	btn_node.textContent = "X";

	// var key_node = document.createElement("div");
	// key_node.setAttribute("style","display:none !important");
	// key_node.textContent = int.toString();

	new_node.appendChild(display_node);
	new_node.appendChild(btn_node);

	var ref_node = document.querySelector(".template");
	document.querySelector(".select_template").insertBefore(new_node,ref_node);
}

function import_load(){
	document.querySelector(".select_template").innerHTML = "";
	let saved_obj = store.get('saved_obj');
	for (var i = saved_obj.length - 1; i >= 0; i--) {
		make_load_box(saved_obj[i],i);
	}
}

function activate_element(){
	document.querySelector("body").innerHTML = document.querySelector("body").innerHTML;	

	document.querySelector(".fas.fa-eraser").addEventListener("click",function(e){
			document.querySelector("#HTML_textarea").value = "";
			document.querySelector("#CSS_textarea").value = "";
			render_html();
	},false)

	document.querySelector(".button").addEventListener("click",function(e){
		save_above_code();
		initialize();
		render_html();
	},false);
	document.querySelector("#HTML_textarea").addEventListener("input",function(e){
		render_html();
	},false);
	document.querySelector("#CSS_textarea").addEventListener("input",function(e){
		render_html();
	},false)

	document.querySelector(".inputHTML").addEventListener("click",function(e){
		
		if (document.querySelector(".inputHTML").className.includes("triggered")){
			return;
		}

		var n1 = document.querySelector(".inputHTML");
		var n2 = document.querySelector(".inputCSS");
		var n3 = document.querySelector("#HTML_textarea");
		var n4 = document.querySelector("#CSS_textarea");

		toggle_class(n1,"triggered");
		toggle_class(n2,"triggered");
		toggle_class(n3,"hidden");
		toggle_class(n4,"hidden");
		document.querySelector(".input_tag").textContent = "HTML5";
		document.querySelector("#HTML_textarea").focus();
	},false);
	document.querySelector(".inputCSS").addEventListener("click",function(e){

		if (document.querySelector(".inputCSS").className.includes("triggered")){
			return;
		}

		var n1 = document.querySelector(".inputHTML");
		var n2 = document.querySelector(".inputCSS");
		var n3 = document.querySelector("#HTML_textarea");
		var n4 = document.querySelector("#CSS_textarea");

		toggle_class(n1,"triggered");
		toggle_class(n2,"triggered");
		toggle_class(n3,"hidden");
		toggle_class(n4,"hidden");
		document.querySelector(".input_tag").textContent = "CSS3";
		document.querySelector("#CSS_textarea").focus();
	},false);

	let saved_obj_ar = document.querySelectorAll(".template");
	for (var i = saved_obj_ar.length - 1; i >= 0; i--) {

		saved_obj_ar[i].addEventListener("click",function(e){
			if (e.target.className != "delete_btn") {
				// document.querySelector("#HTML_textarea").value = this.querySelector(".preview").innerHTML;
				// render_html();
				e.preventDefault();
				var key = get_key(this);
				document.querySelector("#HTML_textarea").value = store.get("saved_obj")[key].html_str;
				document.querySelector("#CSS_textarea").value = store.get("saved_obj")[key].css_str;
				render_html();
				window.location.href="#anchor1";
			}else if (e.target.className == "delete_btn"){

				toggle_class(document.getElementById("confirm"),"pop");

				var this_for_pass = this;

				document.getElementById("confirm").onclick = function(e){


					if (e.target.id == "confirm_true") {
						var key = get_key(this_for_pass);
						this_for_pass.remove();
						var buffer = store.get("saved_obj");
						buffer.splice(key,1);
						store.set("saved_obj",buffer);	
					}
					
					toggle_class(document.getElementById("confirm"),"pop");
				}

				// if(confirm("刪除代碼？")){
				// 	var key = get_key(this);
				// 	this.remove();
				// 	var buffer = store.get("saved_obj");
				// 	buffer.splice(key,1);
				// 	store.set("saved_obj",buffer);					
				// }
			}
		},false);
	}

	document.querySelector("#keyword").addEventListener("keydown",function(e){
		if (e.keyCode==13) {
			filter((document.querySelector("#keyword").value));
			document.querySelector("#keyword").select();
			toggle_class(document.querySelector(".search_btn"),"pressed");
			window.location.href="#anchor2";
			setTimeout(function(){
				toggle_class(document.querySelector(".search_btn"),"pressed");
			},200);
		}
	},false);

	document.querySelector("#keyword").addEventListener("focus",function(e){
		this.select();
	},false);

	document.querySelector(".search_btn").addEventListener("click",function(e){
		filter((document.querySelector("#keyword").value));
		window.location.href="#anchor2";
	},false)


}

function filter(keyword){
	var obj_ar = store.get('saved_obj');
	for (var i = obj_ar.length - 1; i >= 0; i--) {	
		
		if (obj_ar[i].html_str.includes(keyword)||obj_ar[i].css_str.includes(keyword)){ 
			document.querySelector(".select_template").children[i].setAttribute("style","display:inline-block");
		}else{
			document.querySelector(".select_template").children[i].setAttribute("style","display:none");
		}
		
	}
}





function get_key(node){

	var mother_node  = document.querySelector(".select_template");

	for (var i = mother_node.children.length - 1; i >= 0; i--) {
		if (mother_node.children[i] == node) {
			return i
		}
	}
}

// function update_store(){
// 	let saved_obj_ar = document.querySelectorAll(".template .preview");
// 	let saved_obj = [];
// 	for (var i = saved_obj_ar.length - 1; i >= 0; i--) {
// 		let obj = {

// 		};
// 		saved_obj.push(saved_obj_ar[i].innerHTML);
// 	}
// 	saved_obj = saved_obj.reverse();
// 	store.set('saved_obj',saved_obj);
// }


// function refresh_page(){
// 	// update_store();
// 	activate_element();
// 	render_html();
// }

function toggle_class (node, targetClass){
	var classArray = node.className.split(" ");
	for (var i = classArray.length - 1; i >= 0; i--) {
		if (classArray[i] == targetClass){
			classArray.splice(i,1);
			node.setAttribute("class", classArray.join(" "));
			return
		}
	}
	classArray.push(targetClass);
	node.setAttribute("class", classArray.join(" "));
}