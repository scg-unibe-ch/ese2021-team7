import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../models/Post.module";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post = new Post('');

  constructor() { }

  ngOnInit(): void {
  }

}
